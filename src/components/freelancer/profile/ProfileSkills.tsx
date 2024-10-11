import React from 'react';

const ProfileSkills: React.FC = () => {
  // Dummy skills data
  const skills = [
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Node.js' },
    { id: 4, name: 'TypeScript' },
    { id: 5, name: 'CSS' },
    { id: 6, name: 'HTML' },
    { id: 7, name: 'MongoDB' },
  ];

  return (
    <div className="px-14">
      <h2 className="text-2xl font-semibold mb-4">Skills</h2>
      <div className="flex flex-wrap">
        {skills.map(skill => (
          <div
            key={skill.id}
            className="bg-slate-100	  rounded-full px-4 py-2 mr-2 mb-2"
          >
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkills;
