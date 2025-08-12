// FILE: types/testimonial.ts

export interface Testimonial {
  _id: string;
  _type: 'testimonial';
  name: string;
  testimonial: string;
  image?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  school?: string;
  program?: string;
  achievement?: string;
  rating: number;
  featured: boolean;
  publishedAt: string;
}

export interface TestimonialWithImage extends Testimonial {
  imageUrl?: string;
  imageAlt?: string;
}
