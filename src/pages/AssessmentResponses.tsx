import { Assessment } from "../utilities/types";

const AssessmentResponses = ({ assessment }: { assessment: Assessment }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-10">
        Assessment Responses
      </h1>

      <div className="flex justify-center mb-10">
        <p>
          <span className="font-bold">Assessment Date:</span>{" "}
          {assessment.date.toDate().toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZoneName: "short",
          })}
        </p>
      </div>

      <ul>
        {assessment.responses.map((response, index) => (
          <li key={index} className="mb-10">
            <div className="flex justify-between items-center gap-5">
              <div>
                <h3 className="font-semibold mb-3">{response.question}</h3>
                <ul>
                  {response.options.map((option, index) => (
                    <li key={index} className="mb-2">
                      <label
                        className={`${
                          response.answer.includes(index) ? "bg-green-200" : ""
                        } px-2 py-1 rounded`}
                      >
                        <input
                          type={
                            response.type === "multi" ? "checkbox" : "radio"
                          }
                          className="me-3"
                          checked={response.answer.includes(index)}
                          disabled
                        />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="font-semibold">Score:</p>
                <p className="text-2xl">{response.score}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssessmentResponses;
