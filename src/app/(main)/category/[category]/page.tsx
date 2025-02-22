type Props = {
  params: {
    category: string;
  };
};

export default function CategoryPage({ params }: Props) {
  return <div>{params.category}</div>;
}
