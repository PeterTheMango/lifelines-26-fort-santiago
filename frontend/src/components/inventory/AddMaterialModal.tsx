"use client";

import { useState, useRef, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Camera,
  Upload,
  X,
  Check,
  MapPin,
} from "lucide-react";
import { createInventoryItem } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import clsx from "clsx";

import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const unitMap: Record<string, string> = {
  "Concrete Rubble": "kg",
  "Timber Beams": "units",
  "Metal Scraps": "kg",
  "Plastic Sheeting": "rolls",
  "Water (Potable)": "L",
  "Fuel (Diesel)": "L",
  "Aggregates": "kg",
};

export function AddMaterialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState("Concrete Rubble");
  const [coordinates, setCoordinates] = useState({
    lat: 14.5939,
    lng: 120.9712,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;

        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          // If essentially square, skip cropper
          const isSquare = Math.abs(aspectRatio - 1) < 0.05;

          if (isSquare) {
            setImageFile(file);
            setImagePreview(imageUrl);
          } else {
            setTempImageUrl(imageUrl);
            setShowCropper(true);
          }
        };
        img.src = imageUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createCroppedImage = async () => {
    if (!tempImageUrl || !croppedAreaPixels) return;

    const image = new Image();
    image.src = tempImageUrl;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], "cropped-image.jpg", {
          type: "image/jpeg",
        });
        setImageFile(croppedFile);
        setImagePreview(canvas.toDataURL());
        setShowCropper(false);
        setTempImageUrl(null);
      }
    }, "image/jpeg");
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setTempImageUrl(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload a photo of the material");
      return;
    }

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const type = formData.get("type") as string;
    const category = type.includes("Water")
      ? "water"
      : type.includes("Fuel")
      ? "fuel"
      : "construction";
    const unit = unitMap[type] || "kg";

    try {
      await createInventoryItem({
        type: type,
        category: category,
        currentAmount: Number(formData.get("currentAmount")),
        unit: unit,
        location: formData.get("location"),
        lat: coordinates.lat,
        lng: coordinates.lng,
        maxCapacity: 0,
        description: formData.get("description"),
        status: "good",
        requiredAmount: Number(formData.get("requiredAmount") || 0),
      });
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to create item", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Material
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Log Scavenged Material"
        maxWidth="2xl"
      >
        {showCropper && tempImageUrl ? (
          <div className="flex flex-col h-full -mx-6 -my-4">
            <div className="flex-1 relative bg-black/40 min-h-[400px]">
              <Cropper
                image={tempImageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-6 bg-surface-elevated border-t border-border-subtle space-y-4">
               <div className="space-y-2">
                  <div className="flex justify-between text-xs text-text-secondary font-mono mb-1">
                    <span>Zoom</span>
                    <span>{zoom.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-surface-elevated border border-border-subtle accent-primary hover:accent-primary-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                    style={{
                       backgroundImage: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((zoom - 1) / 2) * 100}%, var(--color-border-subtle) ${((zoom - 1) / 2) * 100}%, var(--color-border-subtle) 100%)`
                    }}
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                   <Button variant="ghost" onClick={cancelCrop} className="flex-1">
                     Cancel
                   </Button>
                   <Button onClick={createCroppedImage} className="flex-1">
                     <Check className="w-4 h-4 mr-2" />
                     Apply Crop
                   </Button>
                </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                
                {/* Left Column: Visual Data */}
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                      <Camera className="w-4 h-4 text-primary" />
                      Material Photo <span className="text-danger">*</span>
                    </label>

                    {!imagePreview ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={clsx(
                          "relative group flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer",
                          isDragging
                            ? "border-primary bg-primary/5 scale-[1.02]"
                            : "border-border-subtle bg-surface-elevated hover:border-primary/50 hover:bg-surface-elevated/80"
                        )}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            fileInputRef.current?.click();
                          }
                        }}
                      >
                        <div className="p-3 rounded-full bg-surface border border-border-subtle group-hover:scale-110 transition-transform duration-200">
                           <Upload className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-sm font-medium text-text-primary">
                            Click to upload or drag & drop
                          </p>
                          <p className="text-xs text-text-muted">
                            JPG, PNG or WEBP (max 10MB)
                          </p>
                        </div>
                        
                        <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                           <Button 
                              type="button" 
                              variant="secondary" 
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                           >
                              Browse
                           </Button>
                           <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => cameraInputRef.current?.click()}
                            >
                              Camera
                            </Button>
                        </div>
                        
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                        <input
                          ref={cameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-border-subtle group shadow-md">
                        <img
                          src={imagePreview}
                          alt="Material preview"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
                           <p className="text-xs text-white/90 truncate font-mono w-full">
                              {imageFile?.name}
                           </p>
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-danger text-white rounded-full backdrop-blur-sm transition-colors"
                          aria-label="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Location Map */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Location
                    </label>
                    <div className="relative h-48 rounded-xl overflow-hidden border border-border-subtle ring-offset-background focus-within:ring-2 focus-within:ring-primary/20">
                      <Map
                        initialViewState={{
                          longitude: 120.9712,
                          latitude: 14.5939,
                          zoom: 15,
                        }}
                        style={{ width: "100%", height: "100%" }}
                        mapStyle="mapbox://styles/mapbox/dark-v11"
                        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                        onClick={(e) =>
                          setCoordinates({ lat: e.lngLat.lat, lng: e.lngLat.lng })
                        }
                        cursor="crosshair"
                      >
                        <Marker
                          longitude={coordinates.lng}
                          latitude={coordinates.lat}
                          color="var(--color-primary)"
                        >
                          <div className="relative">
                             <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping" />
                             <MapPin
                                className="w-6 h-6 text-primary drop-shadow-md relative z-10"
                                fill="currentColor"
                             />
                          </div>
                        </Marker>
                      </Map>
                      <div className="absolute bottom-2 left-2 right-2 bg-surface/90 backdrop-blur-md text-[10px] font-mono text-text-secondary px-3 py-1.5 rounded-md border border-border-subtle flex justify-between">
                         <span>Lat: {coordinates.lat.toFixed(5)}</span>
                         <span>Lng: {coordinates.lng.toFixed(5)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Input Data */}
                <div className="space-y-5">
                  <div className="space-y-4 bg-surface-elevated/30 p-4 rounded-xl border border-border-subtle/50">
                    <div className="space-y-2">
                      <label htmlFor="material-type" className="text-sm font-medium text-text-secondary">
                        Material Type
                      </label>
                      <Select
                        name="type"
                        value={selectedType}
                        onValueChange={setSelectedType}
                      >
                        <SelectTrigger className="w-full bg-surface-elevated border-border-subtle h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Concrete Rubble">Concrete Rubble</SelectItem>
                          <SelectItem value="Timber Beams">Timber Beams</SelectItem>
                          <SelectItem value="Metal Scraps">Metal Scraps</SelectItem>
                          <SelectItem value="Plastic Sheeting">Plastic Sheeting</SelectItem>
                          <SelectItem value="Water (Potable)">Water (Potable)</SelectItem>
                          <SelectItem value="Fuel (Diesel)">Fuel (Diesel)</SelectItem>
                          <SelectItem value="Aggregates">Aggregates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="quantity" className="text-sm font-medium text-text-secondary">
                         Quantity
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="quantity"
                          type="number"
                          name="currentAmount"
                          required
                          min="0"
                          step="0.01"
                          className="flex-1 h-11 bg-surface-elevated border border-border-subtle rounded-lg px-4 text-text-primary font-mono placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="0.00"
                        />
                        <div className="w-24 h-11 bg-surface border border-border-subtle rounded-lg flex items-center justify-center text-sm font-mono text-text-muted select-none">
                          {unitMap[selectedType] || "kg"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label htmlFor="location-text" className="text-sm font-medium text-text-secondary">
                          Location Detail
                       </label>
                       <input
                          id="location-text"
                          type="text"
                          name="location"
                          required
                          className="w-full h-11 bg-surface-elevated border border-border-subtle rounded-lg px-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="e.g., Sector A, North Wall"
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label htmlFor="required-amount" className="text-sm font-medium text-text-secondary">
                          Required Target
                       </label>
                       <span className="text-xs text-text-muted bg-surface-elevated px-2 py-0.5 rounded-full border border-border-subtle">Optional</span>
                    </div>
                    <input
                      id="required-amount"
                      type="number"
                      name="requiredAmount"
                      min="0"
                      step="0.01"
                      className="w-full h-11 bg-surface-elevated border border-border-subtle rounded-lg px-4 text-text-primary font-mono placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Target quantity needed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium text-text-secondary">
                       Notes
                    </label>
                    <textarea
                      id="notes"
                      name="description"
                      className="w-full bg-surface-elevated border border-border-subtle rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[100px]"
                      placeholder="Condition, accessibility, or other details..."
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-border-subtle">
               <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
               >
                  Cancel
               </Button>
               <Button
                  type="submit"
                  disabled={submitting || !imageFile}
                  isLoading={submitting}
                  className="min-w-[120px]"
               >
                  {submitting ? "Saving..." : "Save Material"}
               </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
