
const {
    get_active_projects,
    donate_to_project,
    get_reviewer_projects,
  } = require("../../controllers/reviews");
  
  const pool = require("../../db");
  
  jest.mock("../../db", () => ({
    query: jest.fn(),
    getConnection: jest.fn(),
  }));
  
  describe("Project Service", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe("get_active_projects", () => {
      it("should query active projects and return results", async () => {
        const mockResults = [{ project_id: 1, title: "Project 1" }];
        pool.query.mockResolvedValue([mockResults]);
  
        const results = await get_active_projects();
  
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT"));
        expect(results).toEqual(mockResults);
      });
  
      it("should throw if query fails", async () => {
        pool.query.mockRejectedValue(new Error("DB error"));
        await expect(get_active_projects()).rejects.toThrow("DB error");
      });
    });
  
    describe("donate_to_project", () => {
      let mockConn;
  
      beforeEach(() => {
        mockConn = {
          beginTransaction: jest.fn().mockResolvedValue(),
          query: jest.fn().mockResolvedValue(),
          commit: jest.fn().mockResolvedValue(),
          rollback: jest.fn().mockResolvedValue(),
          release: jest.fn(),
        };
        pool.getConnection.mockResolvedValue(mockConn);
      });
  
      it("should perform donation and commit transaction", async () => {
        const data = { reviewer_id: 1, project_id: 2, donated_amt: 100 };
        const result = await donate_to_project(data);
  
        expect(pool.getConnection).toHaveBeenCalled();
        expect(mockConn.beginTransaction).toHaveBeenCalled();
        expect(mockConn.query).toHaveBeenCalledTimes(2);
        expect(mockConn.query).toHaveBeenCalledWith(
          expect.stringContaining("INSERT INTO ReviewerInteractions"),
          [data.reviewer_id, data.project_id, data.donated_amt]
        );
        expect(mockConn.query).toHaveBeenCalledWith(
          expect.stringContaining("UPDATE ProjectData"),
          [data.donated_amt, data.project_id]
        );
        expect(mockConn.commit).toHaveBeenCalled();
        expect(mockConn.release).toHaveBeenCalled();
        expect(result).toEqual({ success: true, message: "Donation recorded successfully." });
      });
  
      it("should rollback on error", async () => {
        mockConn.query.mockRejectedValueOnce(new Error("Insert failed"));
  
        await expect(donate_to_project({ reviewer_id: 1, project_id: 2, donated_amt: 100 })).rejects.toThrow(
          "Insert failed"
        );
  
        expect(mockConn.rollback).toHaveBeenCalled();
        expect(mockConn.release).toHaveBeenCalled();
      });
    });
  
    describe("get_reviewer_projects", () => {
      it("should return reviewer projects", async () => {
        const mockResults = [{ project_id: 1, title: "Proj", description: "desc", Donated_Amt: 50 }];
        pool.query.mockResolvedValue([mockResults]);
  
        const results = await get_reviewer_projects(123);
  
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT"), [123]);
        expect(results).toEqual(mockResults);
      });
  
      it("should throw if query fails", async () => {
        pool.query.mockRejectedValue(new Error("DB error"));
        await expect(get_reviewer_projects(123)).rejects.toThrow("DB error");
      });
    });
  });
  