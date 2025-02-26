'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { alternatives } from '@/db/schema';
import { WithFavicon } from '@/utils/data-table-helpers';
import { ColumnDef } from '@tanstack/react-table';
import { InferSelectModel } from 'drizzle-orm';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import Image from 'next/image';

type Alternative = InferSelectModel<typeof alternatives>;
type AlternativeWithFavicon = WithFavicon<Alternative>;

export const columns: ColumnDef<AlternativeWithFavicon>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableHiding: false,
  },
  {
    id: 'favicon',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Favicon" />,
    cell: ({ row }) => {
      const alternative = row.original;

      return (
        <div className="flex items-center justify-center">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={alternative.faviconUrl}
              alt={`${alternative.name} favicon`}
              className="object-contain"
              fill
              sizes="32px"
            />
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{row.getValue('name')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
    cell: ({ row }) => <div>{row.getValue('slug')}</div>,
  },
  {
    accessorKey: 'isPaid',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pricing" />,
    cell: ({ row }) => {
      const isPaid = row.getValue('isPaid');

      return (
        <div className="flex w-[100px] items-center">
          {isPaid ? <Badge>Paid</Badge> : <Badge variant="outline">Free</Badge>}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      const price = row.getValue('price');

      if (!price) return <div>-</div>;

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price as number);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const alternative = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(alternative.id.toString())}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface AlternativesDataTableProps {
  data: AlternativeWithFavicon[];
}

export function AlternativesDataTable({ data }: AlternativesDataTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      searchPlaceholder="Filter alternatives..."
    />
  );
}
