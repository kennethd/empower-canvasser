import { describe, it } from "@jest/globals";
import { createRoot } from "react-dom/client";
import { ActivityLog } from ".";
import * as responseBody from './activities.json';

// see also another approach described @
// https://www.edupen.in/posts/mocking-in-jest-for-nextjs
//jest.mock('axios');
//const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ActivityLog", () => {
  it("renders without crashing", () => {

    const mockAxios = jest.genMockFromModule('axios');
    mockAxios.get = jest.fn(() => Promise.resolve({ data: responseBody }));

    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<ActivityLog />);
    root.unmount();
  });
});
