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
  FileText,
  RefreshCwIcon,
  Table as TableIcon,
} from "lucide-react";

import {
  createOlt,
  createOltTxt,
  fetchOlt,
  IOltData,
  IOltDataForCreate,
} from "@/modules/OltInfo";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";

export function Home() {
  const { register, handleSubmit, reset } = useForm();

  const [oltExtractorModal, setShowOltExtractorModal] = useState(false);
  const [fileHuawei, setFileHuawei] = useState<File | null>(null);
  const [fileZteState, setFileZteState] = useState<File | null>(null);
  const [fileZteSn, setFileZteSn] = useState<File | null>(null);
  const [oltData, setOltData] = useState<IOltData[]>([]);
  const [fileModalOpen, setFileModalOpen] = useState(false);

  // Função para buscar dados da API
  const fetchData = async () => {
    try {
      const response = await fetchOlt();
      setOltData(response);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseOltModal = () => {
    setShowOltExtractorModal(false);
    reset();
  };

  const handleRefreshTable = () => {
    fetchData();
  };

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
            olt_type: data.olt_type,
          },
        ],
      };

      try {
        await createOlt(dataToSend);
        fetchData(); // Recarregar dados após sucesso
      } catch (error) {
        console.error("Erro ao criar OLT:", error);
        alert("Falha ao criar OLT.");
      }
    }

    handleCloseOltModal();
  };

  const handleCancel = () => {
    reset();
    handleCloseOltModal();
  };

  const handleFileChangeHuawei = (event) => {
    setFileHuawei(event.target.files[0]);
  };

  const handleFileChangeZteState = (event) => {
    setFileZteState(event.target.files[0]);
  };

  const handleFileChangeZteSn = (event) => {
    setFileZteSn(event.target.files[0]);
  };

  const handleSubmitSingleFile = async () => {
    if (!fileHuawei) {
      alert("Por favor, selecione o arquivo Huawei.");
      return;
    }

    const formData = new FormData();
    formData.append("huaweiFile", fileHuawei);

    try {
      await createOltTxt(formData);
      alert("Arquivo Huawei enviado com sucesso!");
      setFileHuawei(null);
      fetchData(); // Recarregar dados após sucesso
    } catch (error) {
      console.error("Erro ao enviar arquivo Huawei:", error);
      alert("Falha ao enviar o arquivo Huawei.");
    }
  };

  const handleSubmitTwoFiles = async () => {
    if (!fileZteState || !fileZteSn) {
      alert("Por favor, selecione ambos os arquivos.");
      return;
    }

    const formData = new FormData();
    formData.append("zteStateFile", fileZteState);
    formData.append("zteSnFile", fileZteSn);

    try {
      await createOltTxt(formData);
      alert("Arquivos ZTE enviados com sucesso!");
      setFileZteState(null);
      setFileZteSn(null);
      fetchData(); // Recarregar dados após sucesso
    } catch (error) {
      console.error("Erro ao enviar arquivos ZTE:", error);
      alert("Falha ao enviar os arquivos ZTE.");
    }
  };

  const standardizeState = (state) => {
    const normalizedState = state.toLowerCase();

    if (
      normalizedState === "working" ||
      normalizedState === "online" ||
      normalizedState === "dyinggasp"
    ) {
      return "Online";
    } else if (normalizedState === "offline" || normalizedState === "offline") {
      return "Offline";
    }

    return "Unknown";
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
                          className="flex gap-1 h-10"
                          variant="default"
                          onClick={() => setFileModalOpen(true)}
                        >
                          <TableIcon className="w-4 h-4 g-3" />
                          Carregar Arquivos OLT
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
                          <TableHead>
                            marca
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
                            <TableCell>
                              {standardizeState(order.state)}
                            </TableCell>
                            <TableCell>{order.olt_type}</TableCell>
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
                    <PaginationLink href="#">2</PaginationLink>
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

      {/* Modal para Carregar Arquivos OLT */}
      <Dialog open={fileModalOpen} onOpenChange={() => setFileModalOpen(false)}>
        <DialogTrigger />
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Carregar Arquivos OLT</DialogTitle>
            <DialogDescription>
              Selecione os arquivos e envie-os para processamento.
            </DialogDescription>
          </DialogHeader>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture"> Carregar saída de único comando</Label>
            <Input
              type="file"
              accept=".txt"
              onChange={handleFileChangeHuawei}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Button className="mb-12" onClick={handleSubmitSingleFile}>
              Enviar saída de único comando
            </Button>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="oltOut1">Carregar saída de dois comandos</Label>
              <Input
                id="oltOut1"
                accept=".txt"
                type="file"
                onChange={handleFileChangeZteState}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mt-2 mb-3">
              <Label htmlFor="oltOut2">Carregar saída de dois comandos</Label>
              <Input
                id="oltOut2"
                accept=".txt"
                type="file"
                onChange={handleFileChangeZteSn}
              />
            </div>

            <Button onClick={handleSubmitTwoFiles}>
              Enviar saída de dois comandos
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Cadastrar OLT */}
      <Dialog open={oltExtractorModal} onOpenChange={handleCloseOltModal}>
        <DialogTrigger />
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastrar OLT</DialogTitle>
            <DialogDescription>
              Preencha o formulário para cadastrar uma nova OLT.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <form onSubmit={handleSubmit(onSubmitOntInfo)}>
              <div className="grid gap-4 w-full">
                <Input placeholder="Slot" {...register("slot")} />
                <Input placeholder="Port" {...register("port")} />
                <Input placeholder="Ont ID" {...register("ont_id")} />
                <Input placeholder="SN" {...register("sn")} />
                <Input placeholder="State" {...register("state")} />
                <Input placeholder="Marca" {...register("olt_type")} />
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit">Gerar Olt Info</Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
