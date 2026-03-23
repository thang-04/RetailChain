import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import ProgressStepper from './ProgressStepper';
import StepOneInfo from './StepOneInfo';
import StepTwoProducts from './StepTwoProducts';
import StepThreeConfirm from './StepThreeConfirm';

import inventoryService from '@/services/inventory.service';
import supplierService from '@/services/supplier.service';

const STEPS = ['Thông tin', 'Sản phẩm', 'Xác nhận'];

const StockInWizard = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Data states
    const [warehouses, setWarehouses] = useState([]);
    const [productVariants, setProductVariants] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);

    // Form data
    const [formData, setFormData] = useState({
        warehouseId: '',
        supplierId: '',
        note: ''
    });
    const [items, setItems] = useState([
        { id: Date.now(), variantId: '', quantity: 1 }
    ]);

    // Errors
    const [errors, setErrors] = useState({});

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [warehouseRes, productRes, supplierRes] = await Promise.all([
                    inventoryService.getAllWarehouses(),
                    inventoryService.getAllProducts(),
                    supplierService.getAllSuppliers()
                ]);

                if (warehouseRes.data) {
                    setWarehouses(warehouseRes.data);
                   const centralWarehouse = warehouseRes.data.find(wh => wh.isCentral === 1);
                    if (centralWarehouse) {
                        setFormData(prev => ({ ...prev, warehouseId: String(centralWarehouse.id) }));
                    }
                }

                if (supplierRes.data) {
                    setSuppliers(supplierRes.data);
                }

                if (productRes.data) {
                    const variantsList = [];
                    const cats = new Set();
                    
                    productRes.data.forEach(product => {
                        if (product.categoryName) cats.add(product.categoryName);
                        if (product.variants && product.variants.length > 0) {
                            product.variants.forEach(variant => {
                                variantsList.push({
                                    id: variant.id,
                                    productId: variant.productId,
                                    name: `${product.name} - ${variant.sku} (${variant.color}/${variant.size})`,
                                    productName: product.name,
                                    sku: variant.sku,
                                    size: variant.size,
                                    color: variant.color,
                                    price: variant.price,
                                    categoryName: product.categoryName
                                });
                            });
                        }
                    });
                    setProductVariants(variantsList);
                    setCategories(Array.from(cats));
                }
            } catch (error) {
                console.error("Failed to load initial data", error);
                toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Validation
    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.warehouseId) {
                newErrors.warehouseId = "Vui lòng chọn kho nhập hàng";
            }
        }

        if (step === 2) {
            const validItems = items.filter(i => i.variantId && i.quantity > 0);
            if (validItems.length === 0) {
                newErrors.items = "Vui lòng thêm ít nhất 1 sản phẩm";
            }
            items.forEach(item => {
                if (!item.variantId) {
                    newErrors[`item_${item.id}`] = "Vui lòng chọn sản phẩm";
                }
                if (!item.quantity || Number(item.quantity) <= 0) {
                    newErrors[`qty_${item.id}`] = "Số lượng phải lớn hơn 0";
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Navigation
    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        } else {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Submit
    const handleSubmit = async () => {
        if (!validateStep(1)) {
            toast.error("Vui lòng điền đầy đủ thông tin bước 1");
            return;
        }
        if (!validateStep(2)) {
            toast.error("Vui lòng điền đầy đủ thông tin bước 2");
            return;
        }

        try {
            setSubmitting(true);

            const validItems = items.filter(i => i.variantId && i.quantity > 0);
            const payload = {
                warehouseId: Number(formData.warehouseId),
                supplierId: formData.supplierId ? Number(formData.supplierId) : null,
                note: formData.note,
                items: validItems.map(item => ({
                    variantId: Number(item.variantId),
                    quantity: Number(item.quantity),
                    note: ""
                }))
            };

            await inventoryService.importStock(payload);
            toast.success("Tạo phiếu nhập kho thành công!");
            navigate('/stock-in');
        } catch (error) {
            console.error("Failed to create stock in:", error);
            toast.error("Đã có lỗi xảy ra khi tạo phiếu nhập. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/stock-in">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Tạo Phiếu Nhập Kho</h2>
                    <p className="text-muted-foreground">Điền thông tin để tạo phiếu nhập kho mới từ nhà cung cấp.</p>
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="bg-white rounded-lg p-4 border shadow-sm">
                <ProgressStepper currentStep={currentStep} steps={STEPS} />
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
                {currentStep === 1 && (
                    <StepOneInfo
                        formData={formData}
                        setFormData={setFormData}
                        warehouses={warehouses}
                        suppliers={suppliers}
                        errors={errors}
                    />
                )}

                {currentStep === 2 && (
                    <StepTwoProducts
                        items={items}
                        setItems={setItems}
                        productVariants={productVariants}
                        categories={categories}
                        errors={errors}
                    />
                )}

                {currentStep === 3 && (
                    <StepThreeConfirm
                        formData={formData}
                        items={items}
                        productVariants={productVariants}
                        suppliers={suppliers}
                        warehouses={warehouses}
                    />
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
                <div>
                    {currentStep > 1 && (
                        <Button variant="outline" onClick={handleBack}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại
                        </Button>
                    )}
                </div>
                <div className="flex gap-3">
                    <Link to="/stock-in">
                        <Button variant="outline">Hủy bỏ</Button>
                    </Link>
                    {currentStep < 3 ? (
                        <Button onClick={handleNext}>
                            Tiếp tục
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleSubmit} 
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Tạo phiếu nhập
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockInWizard;
