import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const ImproveDialog = ({ onOpenChange, imageUrl }) => {
	const [prompt, setPrompt] = useState('');
	const [negativePrompt, setNegativePrompt] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [aiUrl, setAiURL] = useState(null);

	const handleSubmit = async () => {
		if (!prompt.trim()) return;

		setIsSubmitting(true);
		try {
			// Convert image URL to binary
			const response = await fetch(imageUrl);
			const blob = await response.blob();

			// Create FormData to send to backend
			const formData = new FormData();
			formData.append('prompt', prompt);
			formData.append('sketch', blob, 'sketch.png');

			if (negativePrompt.trim()) {
				formData.append('negative_prompt', negativePrompt);
			}

			// Send to backend

			const result = await fetch('http://localhost:8000/generate-image', {
				method: 'POST',
				body: formData,
			});

			if (!result.ok) {
				throw new Error(`HTTP error! status: ${result.status}`);
			}

			const resultBlob = await result.blob();
			const temp_aiUrl = URL.createObjectURL(resultBlob);

			setAiURL(temp_aiUrl);

			setIsSubmitting(false);
			// Process response
			// possibly open a secondary dialog here:

			onOpenChange(false);
			setIsSubmitting(false);
		} catch (error) {
			console.error('Error improving image:', error);
			setIsSubmitting(false);
		}
	};

	return (
		<DialogContent className="sm:max-w-[750px] dark">
			<DialogHeader>
				<DialogTitle className="text-xl font-semibold">
					Improve Your Drawing
				</DialogTitle>
				<DialogDescription>
					Enhance your sketch using AI. Provide prompts to guide the
					transformation.
				</DialogDescription>
			</DialogHeader>

			<div className="grid gap-4 py-4">
				<div className="flex items-center justify-center mb-2 gap-4">
					{/* Original Sketch */}
					<div className="relative w-full max-w-[260px] aspect-[4/3] rounded-md border border-border shadow-sm bg-muted/30 overflow-hidden flex items-center justify-center">
						{imageUrl ? (
							<img
								src={imageUrl}
								alt="Current drawing"
								className="w-full h-full object-contain"
							/>
						) : (
							<span className="text-muted-foreground">No image available</span>
						)}
					</div>

					{/* AI Generated */}
					<div className="relative w-full max-w-[260px] aspect-[4/3] rounded-md border border-border shadow-sm bg-muted/30 overflow-hidden flex items-center justify-center">
						{aiUrl ? (
							<img
								src={aiUrl}
								alt="AI generated result"
								className="w-full h-full object-contain"
							/>
						) : (
							<span className="text-muted-foreground">
								Nothing generated yet!
							</span>
						)}
					</div>
				</div>

				<Tabs defaultValue="prompt" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="prompt">Prompt</TabsTrigger>
						<TabsTrigger value="advanced">Advanced</TabsTrigger>
					</TabsList>
					<TabsContent value="prompt" className="space-y-4 mt-2">
						<div className="space-y-2">
							<Label htmlFor="prompt">Describe what you want to create</Label>
							<Textarea
								id="prompt"
								placeholder="A beautiful landscape with mountains and lakes..."
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								className="min-h-[100px]"
							/>
						</div>
					</TabsContent>

					<TabsContent value="advanced" className="space-y-4 mt-2">
						<div className="space-y-2">
							<Label htmlFor="prompt">Prompt</Label>
							<Textarea
								id="prompt"
								placeholder="A beautiful landscape with mountains and lakes..."
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								className="min-h-[80px]"
							/>
						</div>

						<Separator className="my-2" />

						<div className="space-y-2">
							<Label htmlFor="negative-prompt">
								Negative Prompt (Optional)
							</Label>
							<Textarea
								id="negative-prompt"
								placeholder="Elements to avoid: blurry, distorted, low quality..."
								value={negativePrompt}
								onChange={(e) => setNegativePrompt(e.target.value)}
								className="min-h-[80px]"
							/>
							<p className="text-xs text-muted-foreground">
								Specify elements you want to avoid in the generated image
							</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>

			<DialogFooter>
				<Button variant="outline" onClick={() => onOpenChange(false)}>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					disabled={!prompt.trim() || isSubmitting || !imageUrl}
					className="ml-2"
				>
					{isSubmitting ? 'Processing...' : 'Improve'}
				</Button>
			</DialogFooter>
		</DialogContent>
	);
};

export default ImproveDialog;
