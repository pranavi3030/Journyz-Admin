import { useEffect, useState } from "react";
import { Assessment } from "../utilities/types";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

const calculatePoints = (type: string, optionIndex: number): number => {
  if (type === "single") {
    return 4 - optionIndex;
  } else if (type === "multi") {
    return 1;
  }
  return 0;
};

const AggregateAssessmentResponses = ({
  assessments,
}: {
  assessments: Assessment[];
}) => {
  const [aggregateResponses, setAggregateResponses] = useState(
    {} as Record<
      string,
      {
        answers: number[][];
        options: string[];
        totalScore: number;
        count: number;
        type: string;
      }
    >
  );

  useEffect(() => {
    // Calculate aggregate responses
    const aggregateResponses = assessments.reduce((acc, assessment) => {
      assessment.responses.forEach((response) => {
        if (acc[response.question]) {
          acc[response.question].answers.push(response.answer);
          acc[response.question].totalScore += response.score;
          acc[response.question].count += 1;
        } else {
          acc[response.question] = {
            answers: [response.answer],
            options: response.options,
            totalScore: response.score,
            count: 1,
            type: response.type,
          };
        }
      });
      return acc;
    }, {} as Record<string, { answers: number[][]; options: string[]; totalScore: number; count: number; type: string }>);

    setAggregateResponses(aggregateResponses);
  }, [assessments]);

  // Calculate average score for each question
  const averageScores = Object.keys(aggregateResponses).reduce(
    (acc, question) => {
      const { totalScore, count } = aggregateResponses[question];
      acc[question] = totalScore / count;
      return acc;
    },
    {} as Record<string, number>
  );

  const optionColors = [
    "bg-green-200",
    "bg-yellow-200",
    "bg-blue-200",
    "bg-red-200",
  ];

  return (
    <div className="cumulative-responses">
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-10">
        Aggregate Assessment Responses
      </h1>

      <h3 className="text-xl text-center mb-10">
        <span className="font-semibold">Total Assessments:</span>{" "}
        {assessments.length}
      </h3>

      {Object.entries(aggregateResponses).map(
        ([question, { answers, options, type }]) => {
          const answerCounts = Array(options.length).fill(0);
          answers.flat().forEach((answerIndex) => {
            answerCounts[answerIndex]++;
          });

          const chartData = {
            labels: options,
            datasets: [
              {
                data: answerCounts,
                backgroundColor: ["#86efac", "#fde047", "#93c5fd", "#fca5a5"],
              },
            ],
          };

          return (
            <div
              key={question}
              className="flex justify-between items-center gap-20 mb-20"
            >
              <div className="question w-4/5">
                {/* Question */}
                <h3 className="font-semibold mb-3">
                  {question}
                  {type === "multi" ? (
                    <span className="text-red-500">
                      {" "}
                      (Select all that apply)
                    </span>
                  ) : (
                    ""
                  )}
                </h3>

                {/* Options */}
                <div
                  className={`font-semibold px-2 pb-3 rounded grid grid-cols-3 gap-2`}
                >
                  {/* Option */}
                  <span className="col-span-2">Option</span>

                  {/* Option stats */}
                  <div className="col-span-1 grid grid-cols-3 gap-5">
                    <span className="col-span-1 text-center">Score</span>
                    <span className="col-span-2 text-end me-5">
                      People
                      <span className="ms-3">(%)</span>
                    </span>
                  </div>
                </div>
                <ul>
                  {options.map((option, index) => {
                    const bgColor = optionColors[index % optionColors.length];
                    const points = calculatePoints(type, index);
                    return (
                      <li key={index} className="mb-2">
                        <label>
                          <div
                            className={`${
                              answers.flat().includes(index) ? bgColor : ""
                            } px-2 py-1 rounded grid grid-cols-3 gap-2`}
                          >
                            {/* Option */}
                            <span className="col-span-2">{option}</span>

                            {/* Option stats */}
                            <div className="col-span-1 grid grid-cols-3 gap-5">
                              <span className="col-span-1 text-center">
                                {points}
                              </span>
                              <span className="col-span-2 text-end">
                                {answerCounts[index]}{" "}
                                {answerCounts[index] != 1 ? "people" : "person"}
                                <span className="ms-3">
                                  (
                                  {(
                                    (answerCounts[index] /
                                      answers.flat().length) *
                                    100
                                  ).toFixed(0)}
                                  %)
                                </span>
                              </span>
                            </div>
                          </div>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                {/* Average score */}
                <p className="text-gray-600 font-semibold text-lg mt-5 text-center">
                  Average Score: {averageScores[question].toFixed(2)}
                </p>
              </div>

              {/* Pie chart */}
              <div className="chart w-1/5 flex flex-col items-center gap-5">
                <Pie
                  data={chartData}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context: {
                            label: string;
                            parsed: number;
                            dataset: { data: number[] };
                          }) {
                            return ` ${(
                              (context.parsed /
                                context.dataset.data.reduce(
                                  (a: number, b: number) => a + b
                                )) *
                              100
                            ).toFixed(0)}% - ${context.parsed} ${
                              context.parsed > 1 ? "people" : "person"
                            }`;
                          },
                        },
                      },
                    },
                  }}
                />
                <span className="text-gray-500 font-semibold">
                  Response Distribution in %
                </span>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default AggregateAssessmentResponses;
