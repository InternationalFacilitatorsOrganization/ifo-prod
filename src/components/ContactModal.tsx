import React, { useState } from "react";

interface ContactModalProps {
  facilitatorName: string;
  facilitatorEmail: string;
}

export default function ContactModal({
  facilitatorName,
  facilitatorEmail,
}: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link with form data
    const emailBody = `From: ${formData.name}\nRegarding: ${facilitatorName}\n\n${formData.message}`;
    const mailtoLink = `mailto:info@internationalfacilitators.org?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    setIsOpen(false);
    // Reset form
    setFormData({ name: "", subject: "", message: "" });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-orange-300 text-orange-800 font-bold p-1 flex-nowrap manrope-bold text-sm md:text-lg px-2 md:px-3 hover:cursor-pointer hover:bg-cool-green hover:text-white focus:bg-warm-green focus:text-white solway-bold"
        type="button"
      >
        <i className="icon-mail-alt pr-1 hidden md:inline-block"></i>Contact
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-gray-900 opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="bg-white rounded-lg p-6 relative z-10 max-w-lg w-full mx-4">
            <h2 className="text-2xl solway-bold text-cool-green mb-4">
              Contact {facilitatorName}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 manrope-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 manrope focus:outline-none focus:ring-2 focus:ring-cool-green"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 manrope-bold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Enter subject"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 manrope focus:outline-none focus:ring-2 focus:ring-cool-green"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 manrope-bold mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Enter your message"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 manrope focus:outline-none focus:ring-2 focus:ring-cool-green"
                  required
                />
              </div>
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full px-6 py-2 manrope-bold text-gray-700 hover:bg-gray-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-cool-green text-white font-bold px-6 py-2 manrope-bold hover:bg-warm-green focus:bg-warm-green"
                >
                  Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
