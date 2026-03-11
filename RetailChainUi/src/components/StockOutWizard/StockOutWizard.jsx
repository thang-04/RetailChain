import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import ProgressStepper from './ProgressStepper';
import StepOneInfo from './StepOneInfo';
import StepTwoProducts from './StepTwoProducts';
import StepThreeConfirm from './StepThreeConfirm';

import inventoryService from '@/services/inventory.service';

const STEPS = ['Thông tin', 'Sản phẩm', 'Xác nhận'];

const StockOutWizard = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [centralWarehouses, setCentralWarehouses] = useState([]);
    const [storeWarehouses, setStoreWarehouses] = useState([]);
    const [productVariants, setProductVariants] = useState([]);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        sourceWarehouseId: '',
        targetWarehouseId: '',
        note: ''
    });
    const [items, setItems] = useState([
        { id: Date.now(), variantId: '', quantity: 1 }
    ]);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [warehouseRes, productRes] = await Promise.all([
                    inventoryService.getAllWarehouses(),
                    inventoryService.getAllProducts()
                ]);

                if (warehouseRes.data) {
                    const central = warehouseRes.data.filter(wh => wh.isCentral === true);
                    const stores = warehouseRes.data.filter(wh => wh.isCentral === false);
                    setCentralWarehouses(central);
                    setStoreWarehouses(stores);
                    
                    if (central.length > 0) {
                        setFormData(prev => ({ ...prev, sourceWarehouseId: String(central[0].id) }));
                    }
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
                toast.error("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối server.");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const validateStep = (step) => {
        const newErrors = {};
        
        if (step === 1) {
            if (!formData.targetWarehouseId) {
                newErrors.targetWarehouseId = "Vui lòng chọn kho đích";
            }
        }
        
        if (step === 2) {
            const validItems = items.filter(item => item.variantId && item.quantity > 0);
            if (validItems.length === 0) {
                newErrors.items = "Vui lòng thêm ít nhất 1 sản phẩm";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        setErrors({});
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            
            const validItems = items.filter(item => item.variantId && item.quantity > 0);
            
            const transferData = {
                sourceWarehouseId: parseInt(formData.sourceWarehouseId),
                targetWarehouseId: parseInt(formData.targetWarehouseId),
                note: formData.note,
                items: validItems.map(item => ({
                    variantId: parseInt(item.variantId),
                    quantity: parseInt(item.quantity)
                }))
            };

            await inventoryService.transferStock(transferData);
            
            toast.success("Tạo phiếu xuất kho thành công!");
            navigate('/stock-out');
        } catch (error) {
            console.error("Failed to create stock out", error);
            toast.error("Tạo phiếu xuất kho thất bại. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepOneInfo 
                        formData={formData}
                        setFormData={setFormData}
                        centralWarehouses={centralWarehouses}
                        storeWarehouses={storeWarehouses}
                        errors={errors}
                    />
                );
            case 2:
                return (
                    <StepTwoProducts 
                        formData={formData}
                        items={items}
                        setItems={setItems}
                        productVariants={productVariants}
                        categories={categories}
                        errors={errors}
                    />
                );
            case 3:
                return (
                    <StepThreeConfirm 
                        formData={formData}
                        items={items}
                        centralWarehouses={centralWarehouses}
                        storeWarehouses={storeWarehouses}
                    />
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
            <div className="p-6 border-b bg-white dark:bg-slate-900">
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/stock-out">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Tạo phiếu xuất kho
                    </h1>
                </div>
                
                <ProgressStepper currentStep={currentStep} steps={STEPS} />
            </div>

            <div className="flex-1 overflow-auto p-6">
                {renderStep()}
            </div>

            <div className="p-6 border-t bg-white dark:bg-slate-900 flex justify-between">
                <div>
                    {currentStep > 1 && (
                        <Button 
                            variant="outline" 
                            onClick={handleBack}
                            className="px-6"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại
                        </Button>
                    )}
                </div>
                <div className="flex gap-3">
                    {currentStep < STEPS.length ? (
                        <Button 
                            onClick={handleNext}
                            className="px-6 bg-amber-600 hover:bg-amber-700"
                        >
                            Tiếp theo
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 bg-amber-600 hover:bg-amber-700"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Tạo phiếu xuất
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockOutWizard;
