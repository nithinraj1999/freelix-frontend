import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { fetchReviews } from '../../../api/freelancer/freelancerServices';

const ProfileReview: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
  const [reviews, setReviews] = useState<any>([]);

  useEffect(() => {
    async function getReviews() {
      if (user?._id) {
        const data = {
          freelancerId: user._id,
        };
        const response = await fetchReviews(data);
        console.log(response);
        if (response.allReviews) {
          setReviews(response.allReviews); 
        }
      }
    }
    getReviews();
  }, [user?._id]);

  return (
    <div className="px-14">
      <h2 className="text-2xl font-semibold mb-4 pb-8">Client Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review: any) => {
          const rating = review.rating || 0; // Default to 0 if rating is invalid
          const fullStars = Math.floor(rating); // Number of full stars
          const hasHalfStar = rating % 1 !== 0; // Whether to show a half star
          const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining stars

          return (
            <div key={review._id} className="bg-white border-2 border-inherit rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <img
                  src={review.clientId?.profilePicture}
                  alt={review.clientId?.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{review.clientId?.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-2">
                {/* Stars */}
                <div className="text-yellow-500 flex items-center">
                  {Array(fullStars).fill(0).map((_, i) => (
                    <span key={`full-${i}`} className="text-yellow-500">★</span>
                  ))}
                  {hasHalfStar && <span className="text-yellow-500">☆</span>}
                  {Array(emptyStars).fill(0).map((_, i) => (
                    <span key={`empty-${i}`} className="text-gray-300">★</span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-700">{rating} out of 5</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          );
        })
      ) : (
<div className="flex items-center justify-center w-full h-32 bg-gray-100 border border-gray-300 rounded-lg">
    <p className="text-gray-500 font-medium text-center">No reviews yet.</p>
  </div>
      )}
    </div>
  );
};

export default ProfileReview;
