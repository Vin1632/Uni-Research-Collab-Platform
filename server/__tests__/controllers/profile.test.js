
const { getProfile, updateProfile } = require("../../controllers/profile_controller");
const pool = require("../../db");

jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("Profile Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return profile data when user exists", async () => {
      const mockUser = {
        name: "Jane Doe",
        institution: "ABC University",
        qualification: "PhD",
        interests: "AI, ML",
      };
      pool.query.mockResolvedValue([[mockUser]]);

      const result = await getProfile("jane@example.com");

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT name, institution, qualification, interests FROM users WHERE email = ?",
        ["jane@example.com"]
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw an error if profile is not found", async () => {
      pool.query.mockResolvedValue([[]]);

      await expect(getProfile("notfound@example.com")).rejects.toThrow("Profile not found");
    });

    it("should throw an error on DB failure", async () => {
      pool.query.mockRejectedValue(new Error("DB error"));

      await expect(getProfile("jane@example.com")).rejects.toThrow("DB error");
    });
  });

  describe("updateProfile", () => {
    const validData = {
      email: "jane@example.com",
      name: "Jane",
      institution: "XYZ University",
      qualification: "MSc",
      interests: "Quantum Physics",
    };

    it("should update profile when data is valid", async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await updateProfile(validData);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE users"), [
        validData.name,
        validData.institution,
        validData.qualification,
        validData.interests,
        validData.email.trim(),
      ]);
      expect(result).toEqual({ message: "Profile updated successfully" });
    });

    it("should throw an error when email is missing or invalid", async () => {
      const invalidData = { ...validData, email: "" };
      await expect(updateProfile(invalidData)).rejects.toThrow("Invalid or missing email");
    });

    it("should throw an error when no user is updated", async () => {
      pool.query.mockResolvedValue([{ affectedRows: 0 }]);

      await expect(updateProfile(validData)).rejects.toThrow("Profile update failed: No user found with this email");
    });

    it("should throw an error on DB failure", async () => {
      pool.query.mockRejectedValue(new Error("Update failed"));

      await expect(updateProfile(validData)).rejects.toThrow("Update failed");
    });
  });
});
