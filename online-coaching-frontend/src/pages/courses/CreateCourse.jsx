// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { useToast } from '../../contexts/ToastContext';
// import { courseAPI, teacherAPI } from '../../services/api';
// import { 
//   BookOpen, 
//   ArrowLeft,
//   AlertCircle
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const CreateCourse = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { success: showSuccess, error: showError } = useToast();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     duration: '',
//     price: '',
//     category: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       // Get teacherId first using userId
//       let teacherId = user.id;
//       try {
//         const teacherRes = await teacherAPI.getTeacherByUserId(user.id);
//         teacherId = teacherRes.data.teacherId;
//       } catch (err) {
//         console.log('Teacher record not found, using userId');
//       }

//       await courseAPI.createCourse({
//         ...formData,
//         teacherId: teacherId,
//         price: formData.price ? parseFloat(formData.price) : 0,
//       });
//       showSuccess('Course created successfully!');
//       setFormData({
//         title: '',
//         description: '',
//         duration: '',
//         price: '',
//         category: '',
//       });
//       navigate('/teacher/courses');
//     } catch (err) {
//       showError(err.response?.data?.message || 'Failed to create course');
//       console.error('Course creation error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="flex items-center gap-4 mb-8">
//         <Link to="/teacher/courses" className="p-2 hover:bg-gray-100 rounded-lg">
//           <ArrowLeft size={24} />
//         </Link>
//         <h1 className="page-header mb-0">Create New Course</h1>
//       </div>

//       <div className="card">

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Course Title
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               className="input-field"
//               placeholder="Enter course title"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Description
//             </label>
//             <textarea
//               required
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               className="input-field min-h-32"
//               placeholder="Describe what students will learn in this course"
//               rows={5}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Duration
//               </label>
//               <input
//                 type="text"
//                 value={formData.duration}
//                 onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
//                 className="input-field"
//                 placeholder="e.g., 8 weeks, 40 hours"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Price (₹)
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={formData.price}
//                 onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                 className="input-field"
//                 placeholder="0 for free course"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Category
//             </label>
//             <select
//               value={formData.category}
//               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//               className="input-field"
//             >
//               <option value="">Select a category</option>
//               <option value="programming">Programming</option>
//               <option value="design">Design</option>
//               <option value="business">Business</option>
//               <option value="marketing">Marketing</option>
//               <option value="data-science">Data Science</option>
//               <option value="other">Other</option>
//             </select>
//           </div>

//           <div className="flex gap-4 pt-4">
//             <Link to="/teacher/courses" className="btn-secondary flex-1 text-center">
//               Cancel
//             </Link>
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   Creating...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle size={20} />
//                   Create Course
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateCourse;






import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { courseAPI, teacherAPI } from '../../services/api';
import { 
  BookOpen, 
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    category: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get teacherId first using userId
      let teacherId = user.id;
      try {
        const teacherRes = await teacherAPI.getTeacherByUserId(user.id);
        teacherId = teacherRes.data.teacherId;
      } catch (err) {
        console.log('Teacher record not found, using userId');
      }

      await courseAPI.createCourse({
        ...formData,
        teacherId: teacherId,
        price: formData.price ? parseFloat(formData.price) : 0,
      });
      showSuccess('Course created successfully!');
      setFormData({
        title: '',
        description: '',
        duration: '',
        price: '',
        category: '',
      });
      navigate('/teacher/courses');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create course');
      console.error('Course creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/teacher/courses" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="page-header mb-0">Create New Course</h1>
      </div>

      <div className="card">

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field min-h-32"
              placeholder="Describe what students will learn in this course"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input-field"
                placeholder="e.g., 8 weeks, 40 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input-field"
                placeholder="0 for free course"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
            >
              <option value="">Select a category</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
              <option value="data-science">Data Science</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <Link to="/teacher/courses" className="btn-secondary flex-1 text-center">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;