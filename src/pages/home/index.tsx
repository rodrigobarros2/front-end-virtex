// Home.tsx

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
import { ArrowUpDownIcon, DownloadIcon, RefreshCwIcon } from "lucide-react";

import {
  createOlt,
  fetchOlt,
  IOltData,
  IOltDataForCreate,
} from "@/modules/OltInfo";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export function Home() {
  const { register, handleSubmit, reset } = useForm();

  const [oltExtractorModal, setShowOltExtractorModal] = useState(false);
  const [oltData, setOltData] = useState<IOltData[]>([]);

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
                          variant="default"
                          className="flex gap-1"
                          onClick={() => setShowOltExtractorModal(true)}
                        >
                          <DownloadIcon className="w-5 h-5 g-3" />
                          Extrair Info OLT
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
        <DialogTrigger>Open</DialogTrigger>
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
