import { Badge } from '@/components/ui/badge'
import { getCategories } from '@/features/categories/db/categories';
import React from 'react'

const CategoriesAdminPage = async () => {
  const categories = await getCategories();

  const activeCount = categories.filter(cat => cat.status === 'active').length;
  const inactiveCount = categories.filter(cat => cat.status === 'inactive').length;
  const totalCount = categories.length; 

  return (
    <div className='p-4 sm:p-6 space-y-6'>
      {/* categories Herder */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b'>
        <div className='flex flex-col gap-1'>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Categories Management</h1>
          <p className='text-sm text-muted-foreground'>Organize your product categories effectively.</p>
        </div>
      </div>

      <div className='flex flex-wrap gap-2 sm:gap-3'>
        <Badge
          variant='outline'
          className='px-2 sm:px-3 py-1 text-xs sm:text-sm'
        >
          <span className='font-semibold text-green-600'> { activeCount ? activeCount : 0}</span>
          Active
        </Badge>

        <Badge
          variant='outline'
          className='px-2 sm:px-3 py-1 text-xs sm:text-sm'
        >
          <span className='font-semibold text-red-600'>{inactiveCount ? inactiveCount : 0}</span>
          Inactive
        </Badge>

        <Badge
          variant='outline'
          className='px-2 sm:px-3 py-1 text-xs sm:text-sm'
        >
          <span className='font-semibold text-blue-600'>{totalCount ? totalCount : 0}</span>
          Total
        </Badge>
      </div>

      {/* Form */}
      <div>
        Form
      </div>
    </div>
  )
}

export default CategoriesAdminPage