import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Component that provides tips and guidelines for educators creating their profiles
 */
const EducatorProfileTips = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Profile Creation Tips</CardTitle>
        <CardDescription>How to create an effective educator profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h3 className="font-semibold mb-1">🎯 Choose Specific Subjects</h3>
          <p>Be specific about what subjects you teach (e.g., "Calculus for Engineering Students" rather than just "Math").</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-1">📝 Detail Your Experience & Skills</h3>
          <p>Include work history, teaching achievements (years of experience, institutions, student successes), projects you've completed, and relevant soft skills (communication, teaching ability, patience).</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-1">🧠 Explain Your Teaching Method</h3>
          <p>Describe your teaching philosophy and approach. Do you focus on practical applications? Theory? Interactive exercises?</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-1">🎬 Add a Video Introduction</h3>
          <p>A short 1-3 minute video where you introduce yourself and your teaching style significantly increases student interest.</p>
        </div>
        
        <div className="pt-2 text-primary">
          <p>Complete profiles with detailed information attract 5x more students!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducatorProfileTips; 