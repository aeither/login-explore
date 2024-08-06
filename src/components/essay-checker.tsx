import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopyToClipboard } from "@/lib/hooks";
import { useCompletion } from "ai/react";
import { diffChars } from "diff";
import {
  Clipboard,
  ClipboardCheck,
  GitCompare,
  Loader,
  SearchCheck,
} from "lucide-react";
import { useEffect, useState, type SetStateAction } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

export function EssayChecker() {
  const [activeTab, setActiveTab] = useState("inputEssay");
  const [isCompareEnabled, setIsCompareEnabled] = useState(true);
  const { copyToClipboard, hasCopied } = useCopyToClipboard();

  // const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [diff, setDiff] = useState<Diff.Change[]>([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unnecessary-type-assertion
    const _diff = diffChars(input, outputText) as Diff.Change[];
    setDiff(_diff);
  }, [outputText]);

  const {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
  } = useCompletion({
    // body: { text: inputText },
    onFinish: (prompt, completion) => {
      setOutputText(completion.trim());
    },
    onError: (error) => toast.error(error.message),
  });

  const handleTabChange = (value: SetStateAction<string>) => {
    setActiveTab(value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed left-0 right-0 top-0 z-10 bg-purple-500 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SearchCheck className="h-6 w-6 text-white" />
            <span className="text-lg font-bold text-white">
              Instant Essay Checker
            </span>
          </div>
          {/* <MicroscopeIcon className="h-6 w-6 text-white" /> */}
        </div>
      </div>
      <div className="h-screen bg-purple-500 pb-4 pt-16">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="flex flex-col items-center justify-center"
        >
          <TabsList
            className="mb-4 flex justify-center"
            style={{ backgroundColor: "#C7B8EA" }}
          >
            <TabsTrigger
              value="inputEssay"
              className={`rounded-md px-4 py-2 text-white ${activeTab === "inputEssay" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-light-purple"}`}
              onClick={() => setActiveTab("inputEssay")}
            >
              Essay
            </TabsTrigger>
            <TabsTrigger
              value="compareFixes"
              className={`rounded-md px-4 py-2 text-white ${activeTab === "compareFixes" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-light-purple"}`}
              onClick={() => setActiveTab("compareFixes")}
            >
              Result
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inputEssay" className="w-full">
            <div className="flex flex-grow flex-col items-center justify-center bg-purple-500 px-4">
              <form
                className="flex min-w-full grow flex-col items-center md:justify-center"
                onSubmit={(e) => {
                  handleSubmit(e);
                  // setInput("");

                  setActiveTab("compareFixes");
                }}
              >
                <TextareaAutosize
                  value={input}
                  onChange={handleInputChange}
                  className="flex h-64 max-h-[52rem] min-h-32 w-full min-w-full max-w-lg resize-none rounded-lg border border-gray-200 bg-gray-100 p-4 px-2 pb-6 pt-2 text-sm ring-offset-background drop-shadow-sm transition-colors placeholder:text-muted-foreground focus:border-blue-300 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-blue-700 md:min-w-96"
                  placeholder="Please enter your essay text here..."
                  aria-label="Please enter your essay text here..."
                  cacheMeasurements
                />

                <div className="flex w-full items-center justify-center pb-8">
                  <Button
                    aria-label="Submit"
                    type="submit"
                    className="mt-4 w-full max-w-lg animate-pulse bg-purple-700 text-white hover:bg-yellow-500"
                  >
                    {isLoading ? <Loader /> : "Check"}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
          <TabsContent value="compareFixes" className="w-full">
            <div className="flex flex-grow flex-col items-center justify-center bg-purple-500 px-4 pb-8">
              <div className="flex w-full max-w-lg flex-row items-center justify-between  p-2 ">
                <div className="flex items-center space-x-2">
                  <GitCompare className="h-6 w-6 text-white" />
                  <Switch
                    checked={isCompareEnabled}
                    onCheckedChange={setIsCompareEnabled}
                  />
                </div>

                <Button
                  disabled={input === ""}
                  onClick={() => {
                    void copyToClipboard(outputText);
                    toast.success("Copied successfully!", {
                      duration: 1500,
                      position: "top-center",
                    });
                  }}
                  className=" bg-purple-700 text-white"
                >
                  {hasCopied ? (
                    <ClipboardCheck className="w-5" />
                  ) : (
                    <>
                      <Clipboard className="w-5" />
                    </>
                  )}
                </Button>
              </div>

              {isLoading ? (
                <>
                  <div className="flex h-64  max-h-[52rem] min-h-[80px] w-full min-w-full max-w-lg resize-none flex-col justify-center overflow-y-scroll rounded-lg border border-gray-200 bg-purple-200 p-4 px-2 pb-6 pt-2 text-sm ring-offset-background drop-shadow-sm transition-colors placeholder:text-muted-foreground focus:border-blue-300 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-blue-700 md:min-w-96">
                    <div className="flex flex-col items-center justify-center">
                      <Loader className="h-8 w-8 animate-spin text-gray-500" />
                      <h2 className="mt-4 text-center text-2xl font-medium">
                        Correcting...
                      </h2>
                    </div>
                  </div>
                </>
              ) : isCompareEnabled ? (
                <div className="flex h-64 max-h-[52rem] min-h-[80px] w-full min-w-full max-w-lg resize-none flex-col overflow-y-scroll rounded-lg border border-gray-200 bg-purple-200 p-4 px-2 pb-6 pt-2 text-sm ring-offset-background drop-shadow-sm transition-colors placeholder:text-muted-foreground focus:border-blue-300 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-blue-700 md:min-w-96">
                  <p>
                    {diff.map((part, index) => {
                      const classes = [
                        part.added
                          ? "text-green-600"
                          : part.removed
                            ? "text-red-600"
                            : "text-text",
                        part.removed ? "line-through" : "no-underline",
                        "font-medium",
                      ].join(" ");
                      return (
                        <span key={index} className={classes}>
                          {part.value}
                        </span>
                      );
                    })}
                  </p>
                </div>
              ) : (
                <TextareaAutosize
                  value={outputText}
                  onChange={(e) => setOutputText(e.target.value)}
                  className="flex h-64 max-h-[52rem] min-h-32 w-full min-w-full max-w-44 resize-none rounded-md border border-gray-200 bg-purple-200 p-4 px-2 pb-6 pt-2 text-sm ring-offset-background drop-shadow-sm transition-colors placeholder:text-muted-foreground focus:border-blue-300 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-blue-700 md:min-w-96 md:max-w-lg xl:max-w-2xl"
                  placeholder="Output..."
                  aria-label="Output"
                  cacheMeasurements
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
