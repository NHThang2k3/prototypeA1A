// Path: src/pages/issue-fabric-form/components/PageHeader.tsx

interface Props {
  title: string;
}

const PageHeader = ({ title }: Props) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    </div>
  );
};

export default PageHeader;
