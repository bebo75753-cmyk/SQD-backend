import axios from "axios";

export class AIService {
  static async registerUser(UserID: string) {
    try {
      await axios.post(
        `${process.env.AI_URL}/register`,
        { userId: UserID },
        {
          headers: {
            "x-api-key": process.env.AI_API_KEY,
          },
          timeout: 5000,
        }
      );
    } catch (error: any) {
      console.log("AI Service Error:", error.message);
      //  متكسرش الـ signup
    }
  }
}
