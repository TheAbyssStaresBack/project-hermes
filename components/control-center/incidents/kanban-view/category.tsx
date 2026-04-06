import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

interface CategoryCardProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CategoryCard;
