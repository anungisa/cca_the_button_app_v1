/**
 * Universal Data Table Component
 * Replaces 50+ custom table implementations
 */

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown, 
  Search,
  Download,
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportToCSV } from '../utils/export';

export default function DataTable({
  data = [],
  columns = [],
  title,
  searchable = true,
  sortable = true,
  filterable = false,
  exportable = true,
  pagination = true,
  rowsPerPageOptions = [10, 25, 50, 100],
  onRowClick = null,
  emptyMessage = 'No data available',
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [filters, setFilters] = useState({});

  // Filtering
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchable && searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(term)
        )
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(row => row[key] === value);
      }
    });

    return result;
  }, [data, searchTerm, filters, searchable]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig, sortable]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage, pagination]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSort = (columnKey) => {
    if (!sortable) return;

    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = () => {
    const exportData = sortedData.map(row => {
      const exportRow = {};
      columns.forEach(col => {
        if (!col.hideFromExport) {
          exportRow[col.header] = col.exportValue 
            ? col.exportValue(row)
            : row[col.key];
        }
      });
      return exportRow;
    });

    const filename = `${title?.replace(/\s+/g, '-').toLowerCase() || 'export'}-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(exportData, filename);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Search and Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-brand-text-primary">{title}</h3>
          )}
          <p className="text-sm text-brand-text-secondary">
            {sortedData.length} {sortedData.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {searchable && (
            <div className="relative flex-1 md:flex-none md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {exportable && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={sortedData.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-brand-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-brand-card-bg hover:bg-brand-card-bg">
              {columns.map(column => (
                <TableHead 
                  key={column.key}
                  className={`text-brand-text-primary ${
                    sortable && column.sortable !== false ? 'cursor-pointer select-none' : ''
                  }`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {sortable && column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={row.id || rowIndex}
                  className={onRowClick ? 'cursor-pointer hover:bg-brand-border' : ''}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map(column => (
                    <TableCell key={column.key} className="text-brand-text-secondary">
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key]
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="text-center py-8 text-brand-text-secondary"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-text-secondary">Rows per page:</span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(value) => {
                setRowsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rowsPerPageOptions.map(option => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-brand-text-secondary px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}