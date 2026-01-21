import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StoreTable = () => {
    return (
      <Card className="shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-medium text-text-main dark:text-white tracking-wide">Store Performance</CardTitle>
          <Link to="/store" className="text-sm text-primary font-bold hover:underline cursor-pointer">View All</Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider">Store Name</TableHead>
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider">Location</TableHead>
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider">Manager</TableHead>
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider text-right">Daily Revenue</TableHead>
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider text-center">Status</TableHead>
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider text-right">Inventory Health</TableHead>
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm">
              <TableRow className="hover:bg-primary/5 transition-colors border-gray-100 dark:border-gray-700">
                <TableCell className="px-6 py-4 font-semibold text-text-main dark:text-white">New York Flagship</TableCell>
                <TableCell className="px-6 py-4 text-text-muted">USA, NY</TableCell>
                <TableCell className="px-6 py-4 text-text-main dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQchKQUCIkL_1g1U7J4XVFswAkv-JsIBxssEQ0peeq2JsMvzANoaFpcnr5g6iXcDZdvH-R2X7_lng331UcugUkxqxoYmQdAiV_aCScQ-8Ltb1aEB-mFmjLhd-y9us3noH-CGiapiG7muokHeKK2fwyz4cNrb0bPScw6EmmUNaG08NjiF0VyBctN3NQE6uPoy3gDMvDRha2pQTr8b-R-Uz8cOQ_Rv9N949vCwWs1MKL63I3GtdO_fOSPpGOcxKJ-SToNHr6U0Rjqwo" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    Sarah J.
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right font-medium text-text-main dark:text-white">$42,500</TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 border-none shadow-none">Active</Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="text-green-600 font-bold">98%</span>
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-primary">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-primary/5 transition-colors border-gray-100 dark:border-gray-700">
                <TableCell className="px-6 py-4 font-semibold text-text-main dark:text-white">London Central</TableCell>
                <TableCell className="px-6 py-4 text-text-muted">UK, London</TableCell>
                <TableCell className="px-6 py-4 text-text-main dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT3v0tznixwKcY11-SIravX6x6_VoD5I8sRSUBwdRjFX-jNv_gjwzlzt1z-om95Pcobwf2dLDJbVIgOTiHDbG1fTV3PfoteoKbK0tQv8dgjjXrJkaV7qQ97OGUJk3m0Lygybe7dAPws_sqys0ZExraOlWr-PpetG6Kyj0X-UDUJxKRTHKOqqlnpsLBuTVFLbGBds2D-xHW8r34V5BXGGZ3rUxDq2frffe533WrndtaEhT41qv16MJetTEThQlEXtO01F9vB-OfQhQ" />
                      <AvatarFallback>EW</AvatarFallback>
                    </Avatar>
                    Emma W.
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right font-medium text-text-main dark:text-white">$38,200</TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 border-none shadow-none">Active</Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="text-green-600 font-bold">95%</span>
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-primary">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-primary/5 transition-colors border-gray-100 dark:border-gray-700">
                <TableCell className="px-6 py-4 font-semibold text-text-main dark:text-white">Tokyo Ginza</TableCell>
                <TableCell className="px-6 py-4 text-text-muted">Japan, Tokyo</TableCell>
                <TableCell className="px-6 py-4 text-text-main dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn4DFaeds62o5o5pL0zH3A9eIUaFUru-g5KW7fTNE4Tyt4PZL6VW2VNxFFkKx1yK4e0O3Oscp1B3CMVy64ctCPtUhyjaUHXrtqKu3tfdpnCyxnZ9Iy8LmklhOkzvLBd5Z1cHpBvZRtYtBZ2yilyVSoRedBnlOh-JFc1kvtBMj0MIbVoG2_0Z5Du1GJTNiFXXysy1EjYhQhLP1AL4CdphrD057QaGy5MwIe4suV6aqOd7R3sszALYpFHnv6ojy4RLK4VylXxN64xmo" />
                      <AvatarFallback>KT</AvatarFallback>
                    </Avatar>
                    Kenji T.
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right font-medium text-text-main dark:text-white">$35,100</TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 border-none shadow-none">Active</Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="text-orange-500 font-bold">82%</span>
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-primary">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };
  
  export default StoreTable;
