
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info } from "lucide-react";

export function WeightEstimationGuide() {
    const commonWeights = [
        { category: "Clothing", item: "T-Shirt / Top", weight: "0.15 - 0.20 kg" },
        { category: "Clothing", item: "Jeans / Trousers", weight: "0.40 - 0.70 kg" },
        { category: "Clothing", item: "Dress", weight: "0.30 - 0.50 kg" },
        { category: "Clothing", item: "Jacket / Coat", weight: "0.80 - 1.50 kg" },
        { category: "Clothing", item: "Shoes (Pair)", weight: "0.60 - 1.20 kg" },
        { category: "Electronics", item: "Smartphone", weight: "0.15 - 0.25 kg" },
        { category: "Electronics", item: "Tablet", weight: "0.40 - 0.60 kg" },
        { category: "Electronics", item: "Laptop", weight: "1.20 - 2.50 kg" },
        { category: "Home", item: "Book (Paperback)", weight: "0.20 - 0.40 kg" },
        { category: "Home", item: "Book (Hardcover)", weight: "0.50 - 1.00 kg" },
        { category: "Kitchen", item: "Mug / Cup", weight: "0.30 - 0.40 kg" },
        { category: "Accessories", item: "Handbag", weight: "0.50 - 1.00 kg" },
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button type="button" className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1">
                    <Info className="w-3 h-3" />
                    Not sure? See weight guide
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Common Item Weights</DialogTitle>
                    <DialogDescription>
                        Use these approximate weights to estimate your product's carbon footprint.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-right">Est. Weight</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {commonWeights.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-xs text-gray-500">{item.category}</TableCell>
                                    <TableCell className="text-sm">{item.item}</TableCell>
                                    <TableCell className="text-right text-sm font-mono">{item.weight}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
