import { Education } from '../types/notion';

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (education.length === 0) return null;

  return (
    <section className="mb-12">
      <h3 className="mb-6 text-2xl font-bold">教育背景</h3>
      <div className="space-y-6">
        {education.map((edu) => (
          <div key={edu.id} className="border-l-4 border-green-500 pl-6">
            <div className="mb-2 flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <h4 className="text-xl font-semibold">
                  {edu.degree} - {edu.field}
                </h4>
                <p className="text-lg">{edu.school}</p>
              </div>
              <span className="mt-1 text-sm md:mt-0">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </span>
            </div>
            {edu.gpa && <p>GPA: {edu.gpa}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
