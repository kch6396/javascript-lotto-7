import App from "../src/App.js";
import { MissionUtils } from "@woowacourse/mission-utils";

const mockQuestions = (inputs) => {
  MissionUtils.Console.readLineAsync = jest.fn();

  MissionUtils.Console.readLineAsync.mockImplementation(() => {
    const input = inputs.shift();

    return Promise.resolve(input);
  });
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, "print");
  logSpy.mockClear();
  return logSpy;
};

const runTest = async (input) => {
  mockQuestions(input);
  const app = new App();
  await app.run();
  expect(true).toBe(true);
};

const runException = async (input) => {
  const logSpy = getLogSpy();

  const INPUT_NUMBERS_TO_END = ["3000"];

  mockQuestions([input, ...INPUT_NUMBERS_TO_END]);

  const app = new App();
  await app.run();

  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("[ERROR]"));
};

describe("로또 구매 금액 입력 테스트 - 성공 케이스", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("성공 테스트 - 양의 정수 및 1000원 단위", async () => {
    await runTest(["5000"]);
  });
});

describe("로또 구매 금액 입력 테스트 - 예외 케이스", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test.each([
    {
      testName: "양의 정수가 아닐 때",
      input: "1000j",
    },
    {
      testName: "아무것도 입력이 안됐을 떄",
      input: " ",
    },
    {
      testName: "로또 구매 금액이 1000원 단위가 아닐 때",
      input: "1234",
    },
  ])("예외 테스트 - $testName", async ({ input }) => {
    await runException(input);
  });
});