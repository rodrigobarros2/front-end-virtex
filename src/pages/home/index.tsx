import { useState, useMemo } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { ArrowUpDown, ArrowUpDownIcon } from "lucide-react";

export function Home() {
  const [filters, setFilters] = useState({
    customerNumber: "",
    referenceMonth: "",
    electricityQuantity: "",
    electricityValue: "",
    sceeQuantity: "",
    sceeValue: "",
    compensatedQuantity: "",
    compensatedValue: "",
    publicLightingContrib: "",
  });
  const [showPdfModal, setShowPdfModal] = useState(false);
  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };
  const handleExtractPdf = () => {
    setShowPdfModal(true);
  };
  const handleClosePdfModal = () => {
    setShowPdfModal(false);
  };
  const handleRefreshTable = () => {
    console.log("Refreshing table...");
  };
  const filteredOrders = useMemo(() => {
    return [
      {
        customerNumber: "9",
        referenceMonth: "8",
        electricityQuantity: "7",
        electricityValue: "6",
        sceeQuantity: "5",
        sceeValue: "4",
        compensatedQuantity: "3",
        compensatedValue: "2",
        publicLightingContrib: "1",
      },
      {
        customerNumber: "5678",
        referenceMonth: "July 2023",
        electricityQuantity: "150 kWh",
        electricityValue: "$150.00",
        sceeQuantity: "75 kWh",
        sceeValue: "$37.50",
        compensatedQuantity: "25 kWh",
        compensatedValue: "$12.50",
        publicLightingContrib: "1",
      },
      {
        customerNumber: "9012",
        referenceMonth: "August 2023",
        electricityQuantity: "350 kWh",
        electricityValue: "$350.00",
        sceeQuantity: "150 kWh",
        sceeValue: "$75.00",
        compensatedQuantity: "75 kWh",
        compensatedValue: "$37.50",
        publicLightingContrib: "1",
      },
      {
        customerNumber: "3456",
        referenceMonth: "September 2023",
        electricityQuantity: "450 kWh",
        electricityValue: "$450.00",
        sceeQuantity: "200 kWh",
        sceeValue: "$100.00",
        compensatedQuantity: "100 kWh",
        compensatedValue: "$50.00",
        publicLightingContrib: "1",
      },
    ].filter((order) => {
      return (
        order.customerNumber.includes(filters.customerNumber) &&
        order.referenceMonth.includes(filters.referenceMonth) &&
        order.electricityQuantity.includes(filters.electricityQuantity) &&
        order.electricityValue.includes(filters.electricityValue) &&
        order.sceeQuantity.includes(filters.sceeQuantity) &&
        order.sceeValue.includes(filters.sceeValue) &&
        order.compensatedQuantity.includes(filters.compensatedQuantity) &&
        order.compensatedValue.includes(filters.compensatedValue) &&
        order.publicLightingContrib.includes(filters.publicLightingContrib)
      );
    });
  }, [filters]);
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-1">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 overflow-x-auto">
            <Tabs defaultValue="week">
              <TabsContent value="week">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      Faturas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <div className="relative">
                        <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Filtrar Nº do Cliente"
                          value={filters.customerNumber}
                          onChange={(e) =>
                            handleFilterChange("customerNumber", e.target.value)
                          }
                          className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                        />
                      </div>

                      <div className="flex items-center space-x-2 ml-auto">
                        <Button variant="ghost" onClick={handleRefreshTable}>
                          <RefreshCwIcon className="w-5 h-5 mr-2" />
                          Recarregar
                        </Button>
                        <Button variant="default" onClick={handleExtractPdf}>
                          <DownloadIcon className="w-5 h-5 g-3" />
                          Extrair PDF
                        </Button>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">
                            Nº do Cliente
                          </TableHead>

                          <TableHead className="whitespace-nowrap">
                            Mês de referência
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>

                          <TableHead className="whitespace-nowrap">
                            Elétrica kWh
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>

                          <TableHead className="whitespace-nowrap">
                            Elétrica R$
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>

                          <TableHead className="whitespace-nowrap">
                            SCEEE kWh
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>

                          <TableHead className="whitespace-nowrap">
                            SCEEE R$
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>

                          <TableHead className="whitespace-nowrap">
                            Compensada kWh
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>

                          <TableHead className="whitespace-nowrap">
                            Compensada R$
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>

                          <TableHead className="whitespace-nowrap">
                            Contribuição Publica
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>

                          <TableHead className="text-right whitespace-nowrap">
                            Download
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filteredOrders.map((order, index) => (
                          <TableRow
                            key={index}
                            className={index % 2 === 0 ? "bg-accent" : ""}
                          >
                            <TableCell>
                              <div className="font-medium">
                                {order.customerNumber}
                              </div>
                            </TableCell>
                            <TableCell>{order.referenceMonth}</TableCell>
                            <TableCell>{order.electricityQuantity}</TableCell>
                            <TableCell>{order.electricityValue}</TableCell>
                            <TableCell>{order.sceeQuantity}</TableCell>
                            <TableCell>{order.sceeValue}</TableCell>
                            <TableCell>{order.compensatedQuantity}</TableCell>
                            <TableCell>{order.compensatedValue}</TableCell>
                            <TableCell>{order.publicLightingContrib}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <DownloadIcon className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </TableCell>
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
      <Dialog open={showPdfModal} onOpenChange={handleClosePdfModal}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <FileIcon className="size-12 text-primary" />
            <p className="text-lg font-medium">Extract PDF</p>
            <p className="text-muted-foreground">
              This will generate a PDF report of the orders.
            </p>
            <div className="grid gap-4 w-full">
              <div className="relative">
                <Input
                  placeholder="Customer Number"
                  value={filters.customerNumber}
                  onChange={(e) =>
                    handleFilterChange("customerNumber", e.target.value)
                  }
                  className="w-full pr-8"
                />
              </div>
              <Input
                placeholder="Reference Month"
                value={filters.referenceMonth}
                onChange={(e) =>
                  handleFilterChange("referenceMonth", e.target.value)
                }
              />
              <Input
                placeholder="Electricity Quantity"
                value={filters.electricityQuantity}
                onChange={(e) =>
                  handleFilterChange("electricityQuantity", e.target.value)
                }
              />
              <Input
                placeholder="Electricity Value"
                value={filters.electricityValue}
                onChange={(e) =>
                  handleFilterChange("electricityValue", e.target.value)
                }
              />
              <Input
                placeholder="SCEE Quantity"
                value={filters.sceeQuantity}
                onChange={(e) =>
                  handleFilterChange("sceeQuantity", e.target.value)
                }
              />
              <Input
                placeholder="SCEE Value"
                value={filters.sceeValue}
                onChange={(e) =>
                  handleFilterChange("sceeValue", e.target.value)
                }
              />
              <Input
                placeholder="Compensated Quantity"
                value={filters.compensatedQuantity}
                onChange={(e) =>
                  handleFilterChange("compensatedQuantity", e.target.value)
                }
              />
              <Input
                placeholder="Compensated Value"
                value={filters.compensatedValue}
                onChange={(e) =>
                  handleFilterChange("compensatedValue", e.target.value)
                }
              />
              <Input
                placeholder="Public Lighting Contrib"
                value={filters.publicLightingContrib}
                onChange={(e) =>
                  handleFilterChange("publicLightingContrib", e.target.value)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClosePdfModal}>
              Cancel
            </Button>
            <Button className="ml-auto">Generate PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DownloadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function RefreshCwIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/* import React from "react";
import { useForm } from "react-hook-form";
import { backendClient } from "@/services/api";
import { Header } from "@/components/header";

import { getPdfDownload } from "@/modules/users";

export const Products = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("fatura", data.fatura[0]);
    formData.append("numeroCliente", data.numeroCliente);
    formData.append("mesReferencia", data.mesReferencia);
    formData.append(
      "energiaEletricaQuantidade",
      data.energiaEletricaQuantidade
    );
    formData.append("energiaEletricaValor", data.energiaEletricaValor);
    formData.append("energiaSceeeQuantidade", data.energiaSceeeQuantidade);
    formData.append("energiaSceeeValor", data.energiaSceeeValor);
    formData.append(
      "energiaCompensadaQuantidade",
      data.energiaCompensadaQuantidade
    );
    formData.append("energiaCompensadaValor", data.energiaCompensadaValor);
    formData.append("contribIlumPublica", data.contribIlumPublica);

    try {
      const response = await backendClient.post("/faturas", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao enviar a fatura:", error);
    }
  };

  const handleDownloadPdf = async () => {
    await getPdfDownload();
  };

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="file"
          accept="application/pdf"
          {...register("fatura", { required: true })}
        />
        {errors.fatura && <span>Este campo é obrigatório</span>}

        <input
          type="text"
          placeholder="Número do Cliente"
          {...register("numeroCliente", { required: true })}
        />
        {errors.numeroCliente && <span>Este campo é obrigatório</span>}

        <input
          type="text"
          placeholder="Mês de Referência"
          {...register("mesReferencia", { required: true })}
        />
        {errors.mesReferencia && <span>Este campo é obrigatório</span>}

        <input
          type="text"
          placeholder="Quantidade de Energia Elétrica"
          {...register("energiaEletricaQuantidade", { required: true })}
        />
        {errors.energiaEletricaQuantidade && (
          <span>Este campo é obrigatório</span>
        )}

        <input
          type="text"
          placeholder="Valor de Energia Elétrica"
          {...register("energiaEletricaValor", { required: true })}
        />
        {errors.energiaEletricaValor && <span>Este campo é obrigatório</span>}

        <input
          type="text"
          placeholder="Quantidade de Energia SCEE"
          {...register("energiaSceeeQuantidade", { required: true })}
        />
        {errors.energiaSceeeQuantidade && <span>Este campo é obrigatório</span>}

        <input
          type="text"
          placeholder="Valor de Energia SCEE"
          {...register("energiaSceeeValor", { required: true })}
        />
        {errors.energiaSceeeValor && <span>Este campo é obrigatório</span>}

        <input
          type="text"
          placeholder="Quantidade de Energia Compensada"
          {...register("energiaCompensadaQuantidade", { required: true })}
        />
        {errors.energiaCompensadaQuantidade && (
          <span>Este campo é obrigatório</span>
        )}

        <input
          type="text"
          placeholder="Valor de Energia Compensada"
          {...register("energiaCompensadaValor", { required: true })}
        />
        {errors.energiaCompensadaValor && <span>Este campo é obrigatório</span>}

        <input
          type="text"
          placeholder="Contribuição de Iluminação Pública"
          {...register("contribIlumPublica", { required: true })}
        />
        {errors.contribIlumPublica && <span>Este campo é obrigatório</span>}

        <button type="submit">Enviar</button>
      </form>

      <div>
        <button onClick={() => getPdfDownload('c6fadb35-bd47-4ffe-bd25-9325a060068c')}>Download</button>
      </div>


      
    </div>
  );
};
 */
