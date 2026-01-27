"use client";

import { useState, FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateProject: (name: string, description: string) => Promise<void>;
}

const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

export function CreateProjectModal({ isOpen, onClose, onCreateProject }: CreateProjectModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [nameError, setNameError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setName("");
        setDescription("");
        setNameError("");
        setDescriptionError("");
        setIsLoading(false);
    };

    const validateForm = (): boolean => {
        let isValid = true;

        // Validate name
        if (!name.trim()) {
            setNameError("Project name is required");
            isValid = false;
        } else if (name.length > MAX_NAME_LENGTH) {
            setNameError(`Name must be ${MAX_NAME_LENGTH} characters or less`);
            isValid = false;
        } else {
            setNameError("");
        }

        // Validate description
        if (!description.trim()) {
            setDescriptionError("Project description is required");
            isValid = false;
        } else if (description.length > MAX_DESCRIPTION_LENGTH) {
            setDescriptionError(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`);
            isValid = false;
        } else {
            setDescriptionError("");
        }

        return isValid;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await onCreateProject(name.trim(), description.trim());
            resetForm();
            onClose();
        } catch (error) {
            console.error("Failed to create project:", error);
            setNameError("Failed to create project. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            resetForm();
            onClose();
        }
    };

    const isFormValid = name.trim() && description.trim() && !nameError && !descriptionError;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor="project-name"
                            className="block text-sm font-medium text-text-secondary mb-2"
                        >
                            Project name
                        </label>
                        <input
                            id="project-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (nameError) setNameError("");
                            }}
                            disabled={isLoading}
                            maxLength={MAX_NAME_LENGTH}
                            className="w-full h-11 px-3 py-2.5 bg-surface-elevated border border-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="e.g., Emergency Shelter for Family of 4"
                            aria-invalid={!!nameError}
                            aria-describedby={nameError ? "name-error" : undefined}
                        />
                        <div className="flex items-center justify-between mt-1">
                            {nameError ? (
                                <span id="name-error" className="text-xs text-danger">
                                    {nameError}
                                </span>
                            ) : (
                                <span className="text-xs text-text-muted">
                                    Required
                                </span>
                            )}
                            <span className="text-xs text-text-muted">
                                {name.length}/{MAX_NAME_LENGTH}
                            </span>
                        </div>
                    </div>

                    {/* Description Field */}
                    <div>
                        <label
                            htmlFor="project-description"
                            className="block text-sm font-medium text-text-secondary mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="project-description"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                if (descriptionError) setDescriptionError("");
                            }}
                            disabled={isLoading}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            rows={4}
                            className="w-full px-3 py-2.5 bg-surface-elevated border border-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                            placeholder="Describe what you need to build and any specific requirements..."
                            aria-invalid={!!descriptionError}
                            aria-describedby={descriptionError ? "description-error" : undefined}
                        />
                        <div className="flex items-center justify-between mt-1">
                            {descriptionError ? (
                                <span id="description-error" className="text-xs text-danger">
                                    {descriptionError}
                                </span>
                            ) : (
                                <span className="text-xs text-text-muted">
                                    Required
                                </span>
                            )}
                            <span className="text-xs text-text-muted">
                                {description.length}/{MAX_DESCRIPTION_LENGTH}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 sm:flex-initial"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!isFormValid || isLoading}
                        isLoading={isLoading}
                        className="flex-1 sm:flex-initial sm:min-w-[120px]"
                    >
                        {isLoading ? "Creating..." : "Create Project"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
