import React from 'react';

const ProfileReview: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'John Doe',
      profilePicture: 'https://via.placeholder.com/50',
      rating: 4.5,
      comment: 'Great freelancer! Delivered the project on time and exceeded expectations. Will definitely work with again.',
      date: 'Oct 8, 2024',
    },
    {
      id: 2,
      name: 'Jane Smith',
      profilePicture: 'https://via.placeholder.com/50',
      rating: 5,
      comment: 'Amazing work! Highly recommended for high-quality results. Communication was excellent.',
      date: 'Oct 7, 2024',
    },
    {
      id: 3,
      name: 'Michael Johnson',
      profilePicture: 'https://via.placeholder.com/50',
      rating: 4,
      comment: 'Good experience overall. A few minor revisions were needed, but the final result was solid.',
      date: 'Oct 6, 2024',
    },
  ];

  return (
    <div className="px-14">
      <h2 className="text-2xl font-semibold mb-4 pb-8">Client Reviews</h2>
      {reviews.map(review => (
        <div key={review.id} className="bg-white border-2	border-inherit	 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <img
              src={review.profilePicture}
              alt={review.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{review.name}</h3>
              <p className="text-sm text-gray-500">{review.date}</p>
            </div>
          </div>
          <div className="flex items-center mb-2">
            <div className="text-yellow-500 font-semibold mr-2">
              {Array(Math.floor(review.rating))
                .fill('★')
                .join('')}
              {review.rating % 1 !== 0 ? '☆' : ''}
            </div>
            <span className="text-sm text-gray-700">{review.rating} out of 5</span>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileReview;
