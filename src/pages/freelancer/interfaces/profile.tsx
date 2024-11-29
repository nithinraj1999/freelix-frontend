import { IPortfolioItem } from "../../../components/freelancer/profile/interface/interface";
interface PortfolioItem {
    _id?:string,
    image: string; // URL or path to the image
    description: string; // Description of the portfolio item
    title: string; // Title of the portfolio item
  }
  
  export interface IProfile {
    profilePicture:string
    name: string; // User's name
    title: string; // Job title or professional title
    skills: string[]; // Array of skills (strings)
    description: string; // Brief overview or bio
    portfolio: IPortfolioItem[]; // Array of portfolio items
  }
  