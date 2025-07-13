import { Education } from '../types/notion'

interface EducationSectionProps {
  education: Education[]
}

export default function EducationSection({ education }: EducationSectionProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
    })
  }

  if (education.length === 0) return null

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">教育背景</h3>
      <div className="space-y-6">
        {education.map((edu) => (
          <div key={edu.id} className="border-l-4 border-green-500 pl-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {edu.degree} - {edu.field}
                </h4>
                <p className="text-lg text-gray-600">{edu.school}</p>
              </div>
              <span className="text-sm text-gray-500 mt-1 md:mt-0">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </span>
            </div>
            {edu.gpa && (
              <p className="text-gray-700">
                GPA: {edu.gpa}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}