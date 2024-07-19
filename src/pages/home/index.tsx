import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Header } from "@/components/header";
import {
  ArrowUpDownIcon,
  DownloadIcon,
  FileText,
  RefreshCwIcon,
  Table as TableIcon,
} from "lucide-react";

import {
  createOlt,
  fetchOlt,
  IOltData,
  IOltDataForCreate,
} from "@/modules/OltInfo";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Label } from "@/components/ui/label";

export function Home() {
  const { register, handleSubmit, reset } = useForm();

  const [oltExtractorModal, setShowOltExtractorModal] = useState(false);
  const [oltData, setOltData] = useState<IOltData[]>([]);
  const [fileContent, setFileContent] = useState("");
  const [extractedData, setExtractedData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchOlt();
        setOltData(response);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      }
    }

    fetchData();
  }, []);

  const handleCloseOltModal = () => {
    setShowOltExtractorModal(false);
    reset();
  };

  const handleRefreshTable = () => console.log("Refreshing table...");

  const onSubmitOntInfo: SubmitHandler<FieldValues> = async (data) => {
    if (data.slot || data.port || data.ont_id || data.sn || data.state) {
      const dataToSend: IOltDataForCreate = {
        data: [
          {
            slot: data.slot,
            port: data.port,
            ont_id: data.ont_id,
            sn: data.sn,
            state: data.state,
          },
        ],
      };

      createOlt(dataToSend);
    }

    handleCloseOltModal();
  };

  const handleCancel = () => {
    reset();
    handleCloseOltModal();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
        extractInformation(content);
      };
      reader.readAsText(file);
    }
  };

  function extractInformation(input) {
    const lines = input.split("\n");

    if (lines[1].includes("OnuIndex") && lines[1].includes("Admin State")) {
      return parseOntInfoZTESNsState(input);
    } else if (lines[0].includes("Type") && lines[0].includes("AuthInfo")) {
      return parseOntInfoZTESNs(input);
    } else if (lines[5].includes("F/S/P") && lines[5].includes("ONT")) {
      return parseOntInfoHuawei(input);
    } else {
      throw new Error("Formato de entrada não reconhecido.");
    }
  }

  function parseOntInfoZTESNsState(input) {
    const lines = input.split("\n");
    const data = [];

    for (let i = 3; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === "" || line.startsWith("ONU Number")) {
        continue;
      }

      const columns = line.split(/\s+/);

      const slotPortOnt = columns[0].split(" ");

      const slot = slotPortOnt[0].split("/")[0];
      const port = slotPortOnt[0].split("/")[1];
      const ont_id = slotPortOnt[0].split(":")[1];
      const state = columns[3];

      const onuData = {
        slot: slot,
        port: port,
        ont_id: ont_id,
        state: state,
        sn: "",
      };

      data.push(onuData);
    }

    setExtractedData(data);
  }

  function parseOntInfoZTESNs(input) {
    const lines = input.split("\n");
    const data = [];

    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === "") {
        continue;
      }

      const columns = line.split(/\s+/);
      const onuIndex = columns[0];
      const authInfo = columns[3];
      const state = columns[4];

      const match = onuIndex.match(/gpon-onu_(\d+)\/(\d+)\/(\d+):(\d+)/);
      if (match) {
        const slot = match[1];
        const port = match[2];
        const ont_id = match[4];

        const snMatch = authInfo.match(/SN:(\S+)/);
        const sn = snMatch ? snMatch[1] : "";

        const onuData = {
          slot: slot,
          port: port,
          ont_id: ont_id,
          state: state,
          sn: sn,
        };

        data.push(onuData);
      }
    }

    setExtractedData(data);
  }

  function parseOntInfoHuawei(txt) {
    let lines = txt.split("\n");
    let data = [];
    let inDataSection = false;

    for (let line of lines) {
      if (line.includes("F/S/P   ONT")) {
        inDataSection = true;
        continue;
      }

      if (line.includes("-") && inDataSection) {
        continue;
      }

      if (line.includes("In port")) {
        break;
      }

      if (inDataSection && line.trim() !== "") {
        let parts = line.trim().split(/\s+/);
        if (parts.length >= 7) {
          let slot = parts[1].split("/").shift();
          let port = parts[1].substring(2);
          let ont_id = parts[2];
          let sn = parts[3];
          let state = parts[5];

          data.push({ slot, port, ont_id, sn, state });
        }
      }
    }
    setExtractedData(data);
  }

  const sendExtractedData = async () => {
    try {
      const dataToSend: IOltDataForCreate = {
        data: extractedData,
      };
      await createOlt(dataToSend);
      setFileContent("");
      alert("Dados enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar dados para o back-end:", error);
      alert("Erro ao enviar dados. Verifique o console para mais detalhes.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 overflow-x-auto">
            <Tabs defaultValue="week">
              <TabsContent value="week">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      OntInfo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center space-x-2 ml-auto">
                        <Button variant="ghost" onClick={handleRefreshTable}>
                          <RefreshCwIcon className="w-5 h-5 mr-2" />
                          Recarregar
                        </Button>

                        <Button
                          className="gap-2 w-full md:w-auto h-11 cursor-pointer"
                          type="button"
                          variant={"outline"}
                          asChild
                        >
                          <label>
                            <Input
                              className="hidden"
                              type="file"
                              accept=".txt"
                              onChange={handleFileChange}
                            />
                            <FileText className="w-4 h-4" />
                            Carregar Informações do OLT
                          </label>
                        </Button>

                        <Button onClick={sendExtractedData}>
                          Enviar Dados OLT
                        </Button>

                        <Button
                          className="flex gap-1 h-10"
                          variant="default"
                          onClick={() => setShowOltExtractorModal(true)}
                        >
                          <TableIcon className="w-4 h-4 g-3" />
                          Cadastrar OLT
                        </Button>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>slot</TableHead>
                          <TableHead>
                            port
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>
                          <TableHead>
                            ont_id
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>
                          <TableHead>
                            sn
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>
                          <TableHead>
                            state
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {oltData.map((order, index) => (
                          <TableRow
                            key={index}
                            className={index % 2 === 0 ? "bg-accent" : ""}
                          >
                            <TableCell>{order.slot}</TableCell>
                            <TableCell>{order.port}</TableCell>
                            <TableCell>{order.ont_id}</TableCell>
                            <TableCell>{order.sn}</TableCell>
                            <TableCell>{order.state}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={oltExtractorModal} onOpenChange={handleCloseOltModal}>
        <DialogTrigger />
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle className="sr-only">Extract OLT</DialogTitle>

          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <p className="text-lg font-medium">Extract OLT</p>

            <form onSubmit={handleSubmit(onSubmitOntInfo)}>
              <div className="grid gap-4 w-full">
                <Input placeholder="Slot" {...register("slot")} />
                <Input placeholder="Port" {...register("port")} />
                <Input placeholder="Ont ID" {...register("ont_id")} />
                <Input placeholder="SN" {...register("sn")} />
                <Input placeholder="State" {...register("state")} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">Generate Olt Info</Button>
              </DialogFooter>
            </form>
          </div>
          <p id="olt-extract-description" className="sr-only">
            Fill out the form to extract information about the OLT.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
