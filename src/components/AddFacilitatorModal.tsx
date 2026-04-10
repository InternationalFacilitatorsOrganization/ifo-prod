import React, { useState } from "react";

interface AddFacilitatorModalProps {
  facilitatorCount: number;
}

type Step = "form" | "photo" | "done";

export default function AddFacilitatorModal({
  facilitatorCount,
}: AddFacilitatorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [newId, setNewId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "Active",
    certifications: "",
    yearsOfExperience: "",
    languages: "",
    location: "",
    country: "",
    programOffered: "",
    bio: "",
    website: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetModal = () => {
    setStep("form");
    setNewId(null);
    setSaving(false);
    setUploading(false);
    setMessage(null);
    setPhotoFile(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      status: "Active",
      certifications: "",
      yearsOfExperience: "",
      languages: "",
      location: "",
      country: "",
      programOffered: "",
      bio: "",
      website: "",
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    resetModal();
  };

  const handleOpen = () => {
    resetModal();
    setIsOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Build payload — strip empty optional strings
      const payload: Record<string, string> = {};
      for (const [key, value] of Object.entries(formData)) {
        if (value.trim() !== "") {
          payload[key] = value.trim();
        }
      }

      const response = await fetch("/api/facilitators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNewId(data.id);
        setStep("photo");
        setMessage({
          type: "success",
          text: `Facilitator created successfully (ID: ${data.id}).`,
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to create facilitator.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setMessage(null);

    if (!file) {
      setPhotoFile(null);
      return;
    }

    // Client-side validation
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Only .jpg and .png files are allowed.",
      });
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "File size must be 5 MB or less.",
      });
      e.target.value = "";
      return;
    }

    setPhotoFile(file);
  };

  const handlePhotoUpload = async () => {
    if (!photoFile || !newId) return;

    setUploading(true);
    setMessage(null);

    try {
      const fd = new FormData();
      fd.append("photo", photoFile);

      const response = await fetch(`/api/facilitators/${newId}/photo`, {
        method: "POST",
        body: fd,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: "success", text: "Photo uploaded successfully!" });
        setStep("done");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to upload photo.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleFinish = () => {
    handleClose();
    window.location.reload();
  };

  const handleSkipPhoto = () => {
    handleClose();
    window.location.reload();
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 solway focus:outline-none focus:ring-2 focus:ring-cool-green";
  const labelClass = "block text-gray-600 solway-bold mb-1";

  return (
    <>
      <button
        onClick={handleOpen}
        type="button"
        className="rounded-full bg-cool-green text-white font-bold px-4 py-1.5 solway-bold text-sm hover:cursor-pointer hover:bg-warm-green transition-colors"
      >
        + Add Facilitator
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-900 opacity-50"
            onClick={handleClose}
          ></div>

          {/* Modal */}
          <div className="bg-white rounded-xl shadow-2xl relative z-10 w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto mx-4 p-6 md:p-8">
            {/* Step 1: Create Form */}
            {step === "form" && (
              <>
                <h2 className="text-2xl solway-bold text-cool-green mb-6">
                  Add New Facilitator
                </h2>

                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  {/* Name row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClass}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className={labelClass}>
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer solway">
                        <input
                          type="radio"
                          name="status"
                          value="Active"
                          checked={formData.status === "Active"}
                          onChange={handleChange}
                          className="accent-cool-green"
                        />
                        Active
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer solway">
                        <input
                          type="radio"
                          name="status"
                          value="Inactive"
                          checked={formData.status === "Inactive"}
                          onChange={handleChange}
                          className="accent-cool-green"
                        />
                        Inactive
                      </label>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Certifications */}
                  <div>
                    <label className={labelClass}>Certifications</label>
                    <input
                      type="text"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className={labelClass}>Years of Experience</label>
                    <input
                      type="text"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  {/* Languages */}
                  <div>
                    <label className={labelClass}>Languages</label>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  {/* Location & Country */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Program Offered */}
                  <div>
                    <label className={labelClass}>Program(s) Offered</label>
                    <textarea
                      name="programOffered"
                      value={formData.programOffered}
                      onChange={handleChange}
                      rows={3}
                      className={inputClass}
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className={labelClass}>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className={inputClass}
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className={labelClass}>Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className={inputClass}
                    />
                  </div>

                  {/* Message */}
                  {message && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        message.type === "error"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-full px-6 py-2 solway-bold text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-full bg-cool-green text-white font-bold px-6 py-2 solway-bold hover:bg-warm-green disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {saving ? "Creating…" : "Create Facilitator"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Step 2: Photo Upload */}
            {step === "photo" && (
              <>
                <h2 className="text-2xl solway-bold text-cool-green mb-2">
                  Upload Photo
                </h2>
                <p className="text-gray-500 solway mb-6">
                  Optionally upload a profile photo for{" "}
                  <span className="solway-bold">
                    {formData.firstName} {formData.lastName}
                  </span>
                  .
                </p>

                {message && (
                  <div
                    className={`p-3 rounded-lg text-sm mb-4 ${
                      message.type === "error"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>
                      Photo (.jpg or .png, max 5 MB)
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handlePhotoSelect}
                      className="block w-full text-gray-600 solway file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cool-green file:text-white hover:file:bg-warm-green file:cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleSkipPhoto}
                      className="rounded-full px-6 py-2 solway-bold text-gray-700 hover:bg-gray-100"
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      onClick={handlePhotoUpload}
                      disabled={!photoFile || uploading}
                      className="rounded-full bg-cool-green text-white font-bold px-6 py-2 solway-bold hover:bg-warm-green disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Uploading…" : "Upload Photo"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Done */}
            {step === "done" && (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✓</div>
                <h2 className="text-2xl solway-bold text-cool-green mb-2">
                  Facilitator Added
                </h2>
                <p className="text-gray-500 solway mb-6">
                  <span className="solway-bold">
                    {formData.firstName} {formData.lastName}
                  </span>{" "}
                  has been added to the marketplace.
                </p>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="rounded-full bg-cool-green text-white font-bold px-8 py-2 solway-bold hover:bg-warm-green"
                >
                  Return to Facilitator List
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
