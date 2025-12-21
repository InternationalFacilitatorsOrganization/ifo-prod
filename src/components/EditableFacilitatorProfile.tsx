import { useState } from "react";
import type { Facilitator } from "../lib/turso";
import ContactModal from "./ContactModal";

interface EditableFacilitatorProfileProps {
  facilitator: Facilitator;
}

function EditableFacilitatorProfile({ facilitator }: EditableFacilitatorProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentFacilitator, setCurrentFacilitator] = useState<Facilitator>(facilitator);
  const [formData, setFormData] = useState<Facilitator>(facilitator);
  const [changes, setChanges] = useState<Partial<Facilitator>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(currentFacilitator);
    setChanges({});
    setIsEditing(false);
  };

  const handleChange = (field: keyof Facilitator, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Track changes
    if (value !== currentFacilitator[field]) {
      setChanges({ ...changes, [field]: value });
    } else {
      const newChanges = { ...changes };
      delete newChanges[field];
      setChanges(newChanges);
    }
  };

  const handleReview = () => {
    if (Object.keys(changes).length > 0) {
      setShowModal(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/facilitators/${facilitator.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });

      if (response.ok) {
        // Update the current facilitator state with the new data
        const updatedFacilitator = { ...currentFacilitator, ...changes };
        setCurrentFacilitator(updatedFacilitator);
        setFormData(updatedFacilitator);
        setShowModal(false);
        setIsEditing(false);
        setChanges({});
      } else {
        alert("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <>
      <div className="container lg:w-2/3 md:text-lg px-8 py-8 md:py-14 grid grid-cols-1 md:grid-cols-[25%_1fr] md:gap-2 gap-1">
        {!isEditing && (
          <div className="col-span-2 mb-4 text-right">
            <button
              onClick={handleEdit}
              className="rounded-full bg-cool-green text-white font-bold px-6 py-2 manrope-bold hover:bg-warm-green"
            >
              Edit Profile
            </button>
          </div>
        )}

        {isEditing && (
          <div className="col-span-2 mb-4 flex justify-end gap-4">
            <button
              onClick={handleCancel}
              className="rounded-full px-6 py-2 manrope-bold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleReview}
              disabled={Object.keys(changes).length === 0}
              className="rounded-full bg-cool-green text-white font-bold px-6 py-2 manrope-bold hover:bg-warm-green disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Review Changes
            </button>
          </div>
        )}

        <p className="md:text-right text-gray-500 manrope-bold">Certifications:</p>
        {isEditing ? (
          <input
            type="text"
            value={formData.certifications || ""}
            onChange={(e) => handleChange("certifications", e.target.value)}
            className="pl-2 border border-gray-300 rounded px-3 py-1 manrope focus:outline-none focus:ring-2 focus:ring-cool-green"
          />
        ) : (
          <p className="pl-2 md:text-left text-cool-green pb-3 md:pb-0 manrope">
            {formData.certifications || <span className="text-gray-500 italic">N/A</span>}
          </p>
        )}
        <hr className="col-span-2 border-t border-t-gray-300 my-4" />

        <p className="md:text-right text-gray-500 manrope-bold">Experience:</p>
        {isEditing ? (
          <input
            type="text"
            value={formData.yearsOfExperience || ""}
            onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
            className="pl-2 border border-gray-300 rounded px-3 py-1 manrope focus:outline-none focus:ring-2 focus:ring-cool-green"
          />
        ) : (
          <p className="pl-2 md:text-left text-cool-green pb-3 md:pb-0 manrope">
            {formData.yearsOfExperience
              ? `${formData.yearsOfExperience} years`
              : <span className="text-gray-500 italic">N/A</span>}
          </p>
        )}
        <hr className="col-span-2 border-t border-t-gray-300 my-4" />

        <p className="md:text-right text-gray-500 manrope-bold">Languages:</p>
        {isEditing ? (
          <input
            type="text"
            value={formData.languages || ""}
            onChange={(e) => handleChange("languages", e.target.value)}
            className="indent-6 md:indent-0 border border-gray-300 rounded px-3 py-1 manrope focus:outline-none focus:ring-2 focus:ring-cool-green"
          />
        ) : (
          <p className="pl-2 md:text-left text-cool-green manrope pb-3 md:pb-0">
            {formData.languages || <span className="text-gray-500 italic">N/A</span>}
          </p>
        )}
        <hr className="col-span-2 border-t border-t-gray-300 my-4" />

        <p className="md:text-right text-gray-500 manrope-bold">Location:</p>
        {isEditing ? (
          <input
            type="text"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            className="pl-2 border border-gray-300 rounded px-3 py-1 manrope focus:outline-none focus:ring-2 focus:ring-cool-green"
          />
        ) : (
          <p className="pl-2  md:text-left text-cool-green pb-3 md:pb-0 manrope">
            {formData.location || <span className="text-gray-500 italic">N/A</span>}
          </p>
        )}
        <hr className="col-span-2 border-t border-t-gray-300 my-4" />
        <p className="md:text-right text-gray-500 manrope-bold text-nowrap">
          Program(s) Offered:
        </p>
        {isEditing ? (
          <textarea
            value={formData.programOffered || formData.programsOffered || ""}
            onChange={(e) => handleChange("programOffered", e.target.value)}
            rows={3}
            className="pl-2 md:pl-0 border border-gray-300 rounded px-3 py-1 manrope focus:outline-none focus:ring-2 focus:ring-cool-green"
          />
        ) : (
          <p className="pl-2 md:text-left text-cool-green pb-3 md:pb-0 manrope">
            {formData.programOffered || formData.programsOffered || (
              <span className="text-gray-500 italic">N/A</span>
            )}
          </p>
        )}
        <hr className="col-span-2 border-t border-t-gray-300 my-4" />

        <p className="md:text-right text-gray-500 manrope-bold">&nbsp;</p>

        {!isEditing && (
          <div className="pt-8 flex flex-row gap-8">
            <ContactModal
              facilitatorName={`${currentFacilitator.firstName} ${currentFacilitator.lastName}`}
              facilitatorEmail={currentFacilitator.email}
            />

            {currentFacilitator.website && (
              <a href={currentFacilitator.website} className="no-underline" target="_blank">
                <button className="rounded-full bg-orange-300 text-orange-800 font-bold p-1 flex-nowrap manrope-bold text-sm md:text-lg px-2 md:px-3 hover:cursor-pointer hover:bg-cool-green hover:text-white focus:bg-warm-green focus:text-white text-nowrap">
                  Website <i className="icon-link-ext" />
                </button>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Changes Summary Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-gray-900 opacity-50"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="bg-white rounded-lg p-6 relative z-10 max-w-lg w-full mx-4">
            <h2 className="text-2xl solway-bold text-cool-green mb-4">
              Review Changes
            </h2>
            <div className="space-y-3 mb-6">
              {Object.entries(changes).map(([field, newValue]) => (
                <div key={field} className="border-b pb-2">
                  <p className="text-sm text-gray-500 manrope-bold">
                    {formatFieldName(field)}
                  </p>
                  <div className="flex gap-2 items-center">
                    <span className="text-gray-400 line-through text-sm">
                      {currentFacilitator[field as keyof Facilitator] || "N/A"}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-cool-green font-semibold">
                      {newValue || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full px-6 py-2 manrope-bold text-gray-700 hover:bg-gray-100"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-full bg-cool-green text-white font-bold px-6 py-2 manrope-bold hover:bg-warm-green disabled:bg-gray-400"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditableFacilitatorProfile;
