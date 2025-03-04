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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { projects } from '@/db/schema';
import { SVG_PLACEHOLDER } from '@/lib/favicon';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { InferSelectModel } from 'drizzle-orm';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

type Project = InferSelectModel<typeof projects>;

export const columns: ColumnDef<Project>[] = [
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
      const project = row.original;

      return (
        <div className="flex items-center justify-center">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <OptimizedImage
              isIcon
              src={project.faviconUrl ?? SVG_PLACEHOLDER}
              alt={`${project.name} favicon`}
              className="object-contain"
              fill
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
    accessorKey: 'isLive',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isLive = row.getValue('isLive');

      return (
        <div className="flex w-[100px] items-center">
          {isLive ? <Badge variant="default">Live</Badge> : <Badge variant="outline">Draft</Badge>}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'isFeatured',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Featured" />,
    cell: ({ row }) => {
      const isFeatured = row.getValue('isFeatured');

      return (
        <div className="flex w-[100px] items-center">
          {isFeatured ? (
            <Badge variant="secondary">Featured</Badge>
          ) : (
            <Badge variant="outline">No</Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'scheduledAt',
    enableHiding: true,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Scheduled At" />,
    cell: ({ row }) => {
      const scheduledAt = row.getValue('scheduledAt');

      if (scheduledAt) {
        return <div>{format(scheduledAt as Date, 'MM/dd/yyyy')}</div>;
      }

      return null;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const project = row.original;

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

            <DropdownMenuItem asChild>
              <Link href={`/dev/project/${project.slug}`}>Edit</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface ProjectsDataTableProps {
  data: Project[];
}

export function ProjectsDataTable({ data }: ProjectsDataTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      searchPlaceholder="Filter projects..."
    />
  );
}
