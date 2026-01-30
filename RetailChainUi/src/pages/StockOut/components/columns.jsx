"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export const getColumns = (handleDelete) => [
  {
    accessorKey: "documentCode",
    header: "Mã Phiếu",
  },
  {
    accessorKey: "sourceWarehouseName",
    header: "Kho Xuất",
  },
  {
    accessorKey: "createdAt",
    header: "Ngày Xuất",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString('vi-VN')}</div>
    },
  },
  {
      accessorKey: "note",
      header: "Lý Do",
      cell: ({row}) => row.getValue("note") || "Xuất Bán Hàng"
  },
  {
    accessorKey: "totalItems",
    header: () => <div className="text-right">Số Lượng</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("totalItems")}</div>
    },
  },
  {
    accessorKey: "totalValue",
    header: () => <div className="text-right">Tổng Giá Trị</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalValue"))
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
        const status = row.getValue("status");
        const variant = status === 'Completed' ? 'default' : 'secondary';
        const statusText = status === 'Completed' ? 'Hoàn thành' : 'Chờ duyệt';
      return <Badge variant={variant}>{statusText}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const record = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem>In phiếu</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(record.id)}
              className="text-red-600 focus:text-red-500"
            >
              Xóa phiếu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
