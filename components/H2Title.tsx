interface H2TitleProps {
  title: string;
  className?: string;
}
const H2Title = ({ title, className }: H2TitleProps) => (
  <div className={`mb-10 flex flex-col items-center justify-center ${className}`}>
    <h2 className="section-title">{title}</h2>
    <div className="w-[50px] border-b"></div>
  </div>
);

export default H2Title;
