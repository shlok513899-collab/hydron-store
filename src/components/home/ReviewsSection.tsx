import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Review } from '../../types';

export const ReviewsSection: React.FC = () => {
  const { reviews, submitReview, products } = useStore();
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || 'hydron-onyx-flask');
  const [submitted, setSubmitted] = useState(false);

  const approvedReviews = reviews.filter(r => r.status === 'APPROVED');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment) return;

    const prod = products.find(p => p.id === selectedProductId);
    await submitReview({
      productId: selectedProductId,
      productName: prod?.name || 'Hydron Insulated Flask',
      userName: userName.trim(),
      rating,
      title: title.trim() || 'Verified Experience',
      comment: comment.trim(),
      verifiedBuyer: true,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsWriteModalOpen(false);
      setComment('');
      setTitle('');
      setUserName('');
    }, 1500);
  };

  return (
    <section className="w-full bg-white py-16 sm:py-24 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="space-y-2 text-left">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 font-mono">
              VERIFIED EXPERIENCES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black font-heading">
              TESTED IN THE REAL WORLD
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Read uncensored feedback from athletes, designers, and daily commuters.
            </p>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-zinc-800 transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>WRITE A REVIEW</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-zinc-50 border border-zinc-200 hover:border-black transition-all flex flex-col justify-between space-y-4 text-left"
            >
              <div className="space-y-3">
                {/* Stars & Verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-black">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? 'fill-black text-black' : 'text-zinc-300'
                        }`}
                      />
                    ))}
                  </div>
                  {rev.verifiedBuyer && (
                    <span className="text-[10px] font-mono uppercase text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Buyer
                    </span>
                  )}
                </div>

                {/* Review Title */}
                <h4 className="text-sm font-bold uppercase tracking-tight text-black font-heading line-clamp-1">
                  "{rev.title}"
                </h4>

                {/* Comment */}
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="pt-4 border-t border-zinc-200/80 flex items-center justify-between text-xs">
                <span className="font-bold text-black uppercase font-heading">{rev.userName}</span>
                <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[140px]">
                  {rev.productName || 'Hydron Flask'}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in">
          <div className="w-full max-w-lg bg-white p-6 sm:p-8 shadow-2xl border border-zinc-300 relative text-left">
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black uppercase tracking-tight text-black font-heading mb-1">
              SHARE YOUR HYDRON EXPERIENCE
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Your honest feedback helps us engineer better hydration equipment.
            </p>

            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold uppercase text-black">Thank you for your review!</p>
                <p className="text-xs text-zinc-500">Your review has been submitted.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Select Product:
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Rating (1 to 5 Stars):
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-black text-black' : 'text-zinc-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan V."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Review Headline:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Exceptional cold retention on long rides"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Review Details:
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe thermal performance, weight, grip, and cleaning..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 focus:outline-hidden focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-3.5 hover:bg-zinc-800 transition-colors"
                >
                  SUBMIT REVIEW
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
