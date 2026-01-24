import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const StaffProfile = () => {
    const { id } = useParams();
    // In real app, fetch data based on ID
    const staff = {
        name: "Nguyen Van A",
        role: "Store Manager",
        id: id || "ST001",
        email: "nguyenvana@example.com",
        phone: "0901234567",
        address: "123 Le Loi, District 1, HCMC",
        department: "Management",
        joinDate: "2023-01-15",
        status: "Active"
    };

    return (
        <div className="p-6 space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Employee Profile</h2>
                <Button variant="outline">Edit Profile</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="md:col-span-1">
                    <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.id}`} />
                            <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-bold">{staff.name}</h3>
                            <p className="text-sm text-muted-foreground">{staff.role}</p>
                        </div>
                        <Badge>{staff.status}</Badge>
                        <div className="w-full pt-4 space-y-2 text-left text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">ID:</span>
                                <span className="font-medium">{staff.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Joined:</span>
                                <span className="font-medium">{staff.joinDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Dept:</span>
                                <span className="font-medium">{staff.department}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Details & Settings</CardTitle>
                        <CardDescription>Manage personal information and system access.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList>
                                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                <TabsTrigger value="account">Account & Roles</TabsTrigger>
                                <TabsTrigger value="performance">Performance</TabsTrigger>
                            </TabsList>
                            <TabsContent value="personal" className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input defaultValue={staff.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input defaultValue={staff.phone} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <Input defaultValue={staff.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Input defaultValue={staff.address} />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button>Save Changes</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="account" className="pt-4">
                                <div className="space-y-4">
                                    <h4 className="font-medium">Role Assignment</h4>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Store Manager</Badge>
                                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">Inventory Access</Badge>
                                        <Badge variant="outline" className="cursor-pointer border-dashed">+ Add Role</Badge>
                                    </div>
                                    <div className="pt-4">
                                        <Button variant="destructive">Reset Password</Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StaffProfile;
