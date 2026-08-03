import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Folder, Grid, List, Search, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { categoryAPI } from '../services/api';

const Categories = () => {
  const { colors } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '', parentCategoryId: null, displayOrder: 0 });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && selectedCategory) {
        await categoryAPI.updateCategory(selectedCategory.id, formData);
      } else {
        await categoryAPI.createCategory(formData);
      }
      setShowModal(false);
      setFormData({ name: '', description: '', icon: '', parentCategoryId: null, displayOrder: 0 });
      setIsEditing(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      parentCategoryId: category.parentCategoryId,
      displayOrder: category.displayOrder
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.deleteCategory(categoryId);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>Categories</h1>
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({ name: '', description: '', icon: '', parentCategoryId: null, displayOrder: 0 });
              setShowModal(true);
            }}
            className="px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ backgroundColor: colors.primary, color: colors.onError }}
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSecondary }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'ring-2' : ''}`}
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border,
                ringColor: viewMode === 'grid' ? colors.primary : 'transparent'
              }}
            >
              <Grid size={20} style={{ color: colors.text }} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'ring-2' : ''}`}
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border,
                ringColor: viewMode === 'list' ? colors.primary : 'transparent'
              }}
            >
              <List size={20} style={{ color: colors.text }} />
            </button>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="card p-12 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Folder size={64} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No Categories Found</h3>
            <p style={{ color: colors.textSecondary }}>
              {searchTerm ? 'Try a different search term' : 'Create your first category to get started'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div key={category.id} className="card p-6 hover:shadow-lg transition-shadow" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
                    {category.icon ? (
                      <span style={{ fontSize: 24 }}>{category.icon}</span>
                    ) : (
                      <Folder size={24} style={{ color: colors.primary }} />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: colors.warning + '20', color: colors.warning }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: colors.error + '20', color: colors.error }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                  {category.name}
                </h3>
                
                <p className="text-sm mb-4 line-clamp-2" style={{ color: colors.textSecondary }}>
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1" style={{ color: colors.textSecondary }}>
                    <BookOpen size={14} />
                    {category.courseCount} courses
                  </span>
                  {category.parentCategoryName && (
                    <span style={{ color: colors.textSecondary }}>
                      Parent: {category.parentCategoryName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: colors.surfaceVariant }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Courses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Parent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b" style={{ borderColor: colors.border }}>
                    <td className="px-6 py-4" style={{ color: colors.text }}>
                      <div className="flex items-center gap-2">
                        {category.icon && <span>{category.icon}</span>}
                        <span className="font-semibold">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: colors.textSecondary }}>
                      {category.description}
                    </td>
                    <td className="px-6 py-4" style={{ color: colors.text }}>
                      {category.courseCount}
                    </td>
                    <td className="px-6 py-4" style={{ color: colors.text }}>
                      {category.parentCategoryName || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: colors.warning + '20', color: colors.warning }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: colors.error + '20', color: colors.error }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="card max-w-md w-full" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
                <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                  {isEditing ? 'Edit Category' : 'Add Category'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block mb-2 text-sm" style={{ color: colors.text }}>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Category name..."
                    className="w-full px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm" style={{ color: colors.text }}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Category description..."
                    className="w-full p-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm" style={{ color: colors.text }}>Icon (emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="📚"
                    className="w-full px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm" style={{ color: colors.text }}>Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-2 rounded-lg"
                    style={{ backgroundColor: colors.primary, color: colors.onError }}
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-2 rounded-lg"
                    style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
