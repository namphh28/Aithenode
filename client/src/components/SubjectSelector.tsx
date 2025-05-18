import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: number;
  name: string;
  description?: string;
  subjects?: Subject[];
}

interface Subject {
  id: number;
  name: string;
  categoryId: number;
  description?: string;
}

interface SubjectSelectorProps {
  selectedSubjectIds: number[];
  onChange: (selectedSubjectIds: number[]) => void;
}

export default function SubjectSelector({ selectedSubjectIds, onChange }: SubjectSelectorProps) {
  const [groupedSubjects, setGroupedSubjects] = useState<Record<string, Subject[]>>({});

  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch all subjects
  const { data: subjects, isLoading: subjectsLoading } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
  });

  // Group subjects by category when data is loaded
  useEffect(() => {
    if (categories && subjects) {
      const grouped = categories.reduce((acc, category) => {
        acc[category.name] = subjects.filter(subject => subject.categoryId === category.id);
        return acc;
      }, {} as Record<string, Subject[]>);
      setGroupedSubjects(grouped);
    }
  }, [categories, subjects]);

  // Toggle subject selection
  const toggleSubject = (subjectId: number) => {
    if (selectedSubjectIds.includes(subjectId)) {
      onChange(selectedSubjectIds.filter(id => id !== subjectId));
    } else {
      onChange([...selectedSubjectIds, subjectId]);
    }
  };

  if (categoriesLoading || subjectsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm mb-2">Select the subjects you can teach:</div>
      <div className="max-h-80 overflow-y-auto pr-2">
        {Object.entries(groupedSubjects).map(([categoryName, categorySubjects]) => (
          <div key={categoryName} className="mb-6">
            <h4 className="font-medium text-base mb-3">{categoryName}</h4>
            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categorySubjects.map(subject => (
                    <div key={subject.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`subject-${subject.id}`}
                        checked={selectedSubjectIds.includes(subject.id)}
                        onCheckedChange={() => toggleSubject(subject.id)}
                      />
                      <label
                        htmlFor={`subject-${subject.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {subject.name}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
} 