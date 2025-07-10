
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PaymentInfo } from "@/types/order";

interface PaymentFormProps {
    paymentInfo: PaymentInfo;
    onPaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNextStep: () => void;
    onPrevStep: () => void;
    isPaymentComplete: boolean;
}

export default function PaymentForm({
    paymentInfo,
    onPaymentChange,
    onNextStep,
    onPrevStep,
    isPaymentComplete,
}: PaymentFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={onPaymentChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        inputMode="numeric"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input
                        id="nameOnCard"
                        name="nameOnCard"
                        value={paymentInfo.nameOnCard}
                        onChange={onPaymentChange}
                        placeholder="John M Doe"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
                        <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={onPaymentChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                            inputMode="numeric"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cvv">CVV / CVC</Label>
                        <Input
                            id="cvv"
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={onPaymentChange}
                            placeholder="123"
                            maxLength={4}
                            required
                            inputMode="numeric"
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onPrevStep}>
                    Back to Shipping
                </Button>
                <Button onClick={onNextStep} disabled={!isPaymentComplete}>
                    Continue to Review
                </Button>
            </CardFooter>
        </Card>
    );
}
