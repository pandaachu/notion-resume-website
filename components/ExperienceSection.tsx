import { Experience } from '../types/notion';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">工作經驗</h3>
      <div className="space-y-8">
        {experiences.map((exp) => (
          <div key={exp.id} className="border-l-4 border-blue-500 pl-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {exp.position}
                </h4>
                <p className="text-lg text-gray-600">{exp.company}</p>
              </div>
              <span className="text-sm text-gray-500 mt-1 md:mt-0">
                {formatDate(exp.startDate)} - {exp.current ? '現在' : formatDate(exp.endDate)}
              </span>
            </div>
            <p className="text-gray-700 mb-3">{exp.description}</p>
            {exp.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}