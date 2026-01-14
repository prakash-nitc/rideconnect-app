import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Car, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

export default function ForgotPassword() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { question } = await api.getSecurityQuestion(email);
            setSecurityQuestion(question);
            setStep(2);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to find account",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.resetPassword({ email, securityAnswer, newPassword });
            setStep(3);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to reset password",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-background">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Car className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">RideConnect</h1>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>
                            {step === 1 && "Enter your email to find your account"}
                            {step === 2 && "Answer your security question to reset password"}
                            {step === 3 && "Password reset successful"}
                        </CardDescription>
                    </CardHeader>

                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="aditya@nitc.ac.in"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Searching...' : 'Continue'}
                                </Button>
                                <Button variant="ghost" type="button" onClick={() => navigate('/auth')} className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                                </Button>
                            </CardFooter>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleResetSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Security Question</Label>
                                    <div className="p-3 bg-muted rounded-md text-sm font-medium">
                                        {securityQuestion}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="answer">Security Answer</Label>
                                    <Input
                                        id="answer"
                                        type="text"
                                        placeholder="Your answer"
                                        value={securityAnswer}
                                        onChange={(e) => setSecurityAnswer(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </Button>
                                <Button variant="ghost" type="button" onClick={() => setStep(1)} className="w-full">
                                    Back
                                </Button>
                            </CardFooter>
                        </form>
                    )}

                    {step === 3 && (
                        <CardContent className="space-y-6 pt-6">
                            <div className="text-center space-y-2">
                                <div className="text-green-500 font-medium">
                                    Your password has been successfully reset.
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    You can now log in with your new password.
                                </p>
                            </div>
                            <Button onClick={() => navigate('/auth')} className="w-full">
                                Go to Login
                            </Button>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}
