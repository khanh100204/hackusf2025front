const Toolbar = ({
	strokeColor,
	setStrokeColor,
	lineWidth,
	setLineWidth,
	isEraser,
	setIsEraser,
	handleClear,
	handleUndo,
	handleDownload,
	showModel,
	setShowModel,
}) => {
	return (
		<div className="bg-neutral-800 p-6 shadow-md space-y-6 w-[350px]">
			<h1 className="text-2xl font-bold text-gray-100 w-[350px]">Draw.</h1>

			<div className="flex flex-wrap gap-6 flex-col">
				<div className="form-control space-y-2">
					<label
						htmlFor="stroke"
						className="block text-sm font-medium text-gray-50"
					>
						Stroke
					</label>
					<input
						id="stroke"
						type="color"
						value={strokeColor}
						onChange={(e) => setStrokeColor(e.target.value)}
						className="w-16 h-8 border border-gray-300 rounded-md"
					/>
				</div>

				<div className="form-control space-y-2">
					<label
						htmlFor="lineWidth"
						className="block text-sm font-medium text-gray-50"
					>
						Line Width
					</label>
					<input
						id="lineWidth"
						type="number"
						min="1"
						max="100"
						value={lineWidth}
						onChange={(e) => setLineWidth(Number(e.target.value))}
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
					<div className="flex space-x-2 mt-2 flex-col">
						<div>
							{[2, 4, 6, 8, 10].map((width) => (
								<Button
									key={width}
									onClick={() => setLineWidth(width)}
									variant={lineWidth === width ? 'default' : 'outline'}
									className="m-2 w-[40px] h-[40px] p-0"
								>
									{width}
								</Button>
							))}
						</div>
						<div>
							{[12, 14, 16, 18, 20].map((width) => (
								<Button
									key={width}
									onClick={() => setLineWidth(width)}
									variant={lineWidth === width ? 'default' : 'outline'}
									className="m-2 w-[40px] h-[40px] p-0"
								>
									{width}
								</Button>
							))}
						</div>
					</div>
				</div>

				<div className="form-control space-y-2">
					<label className="text-sm font-medium text-gray-50">Mode</label>
					<div className="flex space-x-2">
						<Button
							onClick={() => setIsEraser(false)}
							variant={!isEraser ? 'default' : 'outline'}
							className="flex-1"
						>
							Brush
						</Button>
						<Button
							onClick={() => setIsEraser(true)}
							variant={isEraser ? 'default' : 'outline'}
							className="flex-1"
						>
							Eraser
						</Button>
					</div>
				</div>

				<div className="space-y-2">
					<Button
						onClick={handleClear}
						variant="destructive"
						className="w-full"
					>
						Clear
					</Button>
					<Button
						onClick={handleUndo}
						variant="secondary"
						className="w-full bg-yellow-800 hover:bg-yellow-700"
					>
						Undo
					</Button>
					<Button
						onClick={handleDownload}
						variant="secondary"
						className="w-full bg-green-800 hover:bg-green-700"
					>
						Improve with AI
					</Button>
					<Button
						onClick={() => setShowModel(!showModel)}
						variant="secondary"
						className="w-full bg-blue-800 hover:bg-blue-700"
					>
						Toggle Model
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Toolbar;
