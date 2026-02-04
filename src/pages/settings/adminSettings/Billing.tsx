import { Button } from "@mui/material";
import { ChevronDown } from "lucide-react";
import TabsComponent from "@/components/tabs/TabsComponent";
import React, { useState } from "react";

const primaryButtonSx = {
  height: "36px",
  backgroundColor: "#6E41E2",
  textTransform: "none",
  fontSize: "12px",
  fontWeight: 500,
  borderRadius: "4px",
  boxShadow: "none",
  width: "140px",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#7B52F4",
    boxShadow: "none",
  },
};
const popButtonSx = {
  height: "36px",
  backgroundColor: "#6E41E2",
  textTransform: "none",
  fontSize: "12px",
  fontWeight: 500,
  borderRadius: "4px",
  boxShadow: "none",
  width: "90px",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#7B52F4",
    boxShadow: "none",
  },
};

const outlineButtonSx = {
  height: "36px",
  borderColor: "#CCCCCC80",
  color: "#333333",
  textTransform: "none",
  fontSize: "12px",
  fontWeight: 500,
  borderRadius: "4px",
  width: "90px",
  boxShadow: "none",
  "&:hover": {
    borderColor: "#CCCCCC80",
    backgroundColor: "#F3F4F6",
    boxShadow: "none",
  },
};


// const successButtonSx = {
//   height: "36px",
//   backgroundColor: "#36C248",
//   textTransform: "none",
//   fontSize: "12px",
//   fontWeight: 500,
//   borderRadius: "4px",
//   boxShadow: "none",
//   color: "#FFFFFF",
//   minWidth: "90px",
//   "&:hover": {
//     backgroundColor: "#4CD35C",
//     boxShadow: "none",
//   },
// };

const fieldWrapperClass = "flex flex-col gap-1.5";
const fieldWrapperWithErrorClass = "relative flex flex-col pb-[14px]";
const fieldInputClass = "h-[40px] w-full rounded-[4px] border border-[#CCCCCC80] bg-white px-3 text-[13px] text-[#333333] hover:border-[#666666] focus:border-[#333333] focus:outline-none";
const fieldSelectClass = `${fieldInputClass} appearance-none pr-8`;

const VisaIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="40"
    height="24"
    viewBox="0 0 40 24"
    role="img"
    aria-label="Visa"
  >
    <rect x="0.5" y="0.5" width="39" height="23" rx="4" fill="#FFFFFF" stroke="#D6D6D6" />
    <text
      x="20"
      y="16"
      textAnchor="middle"
      fontSize="12"
      fontWeight="800"
      fill="#1A1F71"
      fontFamily="Arial, sans-serif"
      letterSpacing="0.5"
    >
      VISA
    </text>
  </svg>
);

const MastercardIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="40"
    height="24"
    viewBox="0 0 40 24"
    role="img"
    aria-label="Mastercard"
  >
    <rect x="0.5" y="0.5" width="39" height="23" rx="4" fill="#FFFFFF" stroke="#D6D6D6" />
    <circle cx="18" cy="12" r="6.2" fill="#EB001B" />
    <circle cx="22" cy="12" r="6.2" fill="#F79E1B" />
    <circle cx="20" cy="12" r="6.2" fill="#F04624" opacity="0.9" />
  </svg>
);

export const Billing: React.FC = () => {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [showCardErrors, setShowCardErrors] = useState(false);
  const [cardNumber, setCardNumber] = useState("1234 1234 1234 1234");
  const [cardExpiry, setCardExpiry] = useState("01 / 27");
  const [cardCvc, setCardCvc] = useState("123");
  const [cardName, setCardName] = useState("John D");
  const [cardCountry, setCardCountry] = useState("New Zealand");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [showTransferErrors, setShowTransferErrors] = useState(false);
  const [transferOwnerName, setTransferOwnerName] = useState("");
  const [transferOwnerEmail, setTransferOwnerEmail] = useState("");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCompanyModalVisible, setIsCompanyModalVisible] = useState(false);
  const [showCompanyErrors, setShowCompanyErrors] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [isBillingEmailModalOpen, setIsBillingEmailModalOpen] = useState(false);
  const [isBillingEmailModalVisible, setIsBillingEmailModalVisible] = useState(false);
  const [showBillingEmailErrors, setShowBillingEmailErrors] = useState(false);
  const [billingEmail, setBillingEmail] = useState("");
  const invoices = [
    { id: "12736458", date: "21 Aug 2025", amount: "US$69", status: "Unpaid" },
    { id: "12736457", date: "21 Jul 2025", amount: "US$69", status: "Unpaid" },
    { id: "12736456", date: "21 Jun 2025", amount: "US$69", status: "Paid" },
  ];

  const billingContent = (
    <div className="bg-white border border-[#CCCCCC80]  overflow-hidden">
      <div className="h-[46px] px-4 flex items-center bg-[#FAFAFA] border-b border-[#CCCCCC80]">
        <span className="text-[14px] font-[500] text-[#333333]">All Invoices</span>
      </div>
      <div className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_48px] gap-2 px-4 py-3 text-[13px] font-[500] text-[#333333] border-b border-[#CCCCCC80]">
        <span>Invoice Number</span>
        <span>Invoice Date</span>
        <span>Amount</span>
        <span>Status</span>
        <span />
      </div>
      <div className="divide-y divide-[#CCCCCC80]">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_48px] gap-2 px-4 py-3 text-[13px] text-[#333333] items-center"
          >
            <button type="button" className="text-left text-[#6E41E2] hover:underline">
              {invoice.id}
            </button>
            <span>{invoice.date}</span>
            <span>{invoice.amount}</span>
            <span className={invoice.status === "Unpaid" ? "text-[#E4554A]" : "text-[#333333]"}>
              {invoice.status}
            </span>
            <button
              type="button"
              aria-label={`download invoice ${invoice.id}`}
              className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-[4px] border border-[#CCCCCC80] text-[#666666] hover:bg-[#F3F4F6]"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 3V12.5M10 12.5L6.5 9M10 12.5L13.5 9M4 15.5H16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const subscriptionContent = (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-[#CCCCCC80]  overflow-hidden">
        <div className="h-[46px] px-4 flex items-center justify-between bg-[#FAFAFA] border-b border-[#CCCCCC80]">
          <span className="text-[14px] font-[500] text-[#333333]">Pricing Plan</span>
          <div className="h-[32px] px-3 rounded-[4px] w-[140px] border border-[#CCCCCC80] text-[12px] text-[#333333] flex items-center">
            Currency: USD
          </div>
        </div>

        <div className="px-4 py-4 border-b border-[#CCCCCC80] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-[14px] font-[500] text-[#333333]">Starter</div>
            <button type="button" className="text-[12px] text-[#6E41E2] hover:underline w-fit">Plan Features</button>
          </div>
          <div className="text-[14px] text-[#333333]">
            <span className="text-[18px] font-[600]">$69</span> <span className="text-[12px]">per user / month</span>
          </div>
          <Button
            variant="contained"
            sx={primaryButtonSx}
            onClick={() => {
              setIsUpgradeModalOpen(true);
              requestAnimationFrame(() => setIsUpgradeModalVisible(true));
            }}
          >
            Upgrade Plan
          </Button>
        </div>

        <div className="px-4 py-4 border-b border-[#CCCCCC80]">
          <div className="text-[13px] text-[#333333]/70">Account Activation Date</div>
          <div className="text-[13px] text-[#333333]">21 / 08 / 2025</div>
        </div>

        <div className="px-4 py-4 border-b border-[#CCCCCC80] flex items-center justify-between gap-4">
          <div>
            <div className="text-[13px] text-[#333333]/70">Account Owner</div>
            <div className="text-[13px] text-[#333333]">John Doe</div>
          </div>
          <Button
            variant="contained"
            sx={primaryButtonSx}
            onClick={() => {
              setIsTransferModalOpen(true);
              setShowTransferErrors(false);
              requestAnimationFrame(() => setIsTransferModalVisible(true));
            }}
          >
            Transfer Ownership
          </Button>
        </div>

        <div className="px-4 py-4 border-b border-[#CCCCCC80]">
          <div className="text-[13px] text-[#333333]/70">Active User(s)</div>
          <div className="text-[16px] font-[600] text-[#333333]">10</div>
        </div>

        <div className="px-4 py-4">
          <div className="text-[13px] text-[#333333]/70">Account ID</div>
          <div className="text-[13px] text-[#333333]">PFAC1057</div>
        </div>
      </div>

      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
        <div className="h-[46px] px-4 flex items-center bg-[#FAFAFA] border-b border-[#CCCCCC80]">
          <span className="text-[14px] font-[500] text-[#333333]">Payment Details</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-[2.2fr_1fr_1fr] gap-4">
            <div className={fieldWrapperClass}>
              <label className="text-[13px] text-[#333333]/70">Card Number</label>
              <div className="relative">
                <input className={fieldInputClass} value="1234 1234 1234 1234" readOnly />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <VisaIcon />
                  <MastercardIcon />
                </div>
              </div>
            </div>
            <div className={fieldWrapperClass}>
              <label className="text-[13px] text-[#333333]/70">Expiry Date</label>
              <input className={fieldInputClass} value="01 / 27" readOnly />
            </div>
            <div className={fieldWrapperClass}>
              <label className="text-[13px] text-[#333333]/70">Security Code</label>
              <input className={fieldInputClass} value="123" readOnly />
            </div>
            <div className={fieldWrapperClass}>
              <label className="text-[13px] text-[#333333]/70">Name on the Card</label>
              <input className={fieldInputClass} value="John D" readOnly />
            </div>
            <div className={fieldWrapperClass + " md:col-span-2"}>
              <label className="text-[13px] text-[#333333]/70">Country</label>
              <div className="relative">
                <select className={fieldSelectClass} defaultValue="New Zealand" disabled>
                  <option>New Zealand</option>
                  <option>Australia</option>
                  <option>United States</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
              </div>
            </div>
          </div>
          <div className="mt-4 text-[12px] text-[#333333]/70">
            By providing your card information, you allow Pathfinder ATS CRM to charge your card for future payments in accordance with their terms.
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="contained"
              sx={primaryButtonSx}
              onClick={() => {
                setIsCardModalOpen(true);
                setShowCardErrors(false);
                requestAnimationFrame(() => setIsCardModalVisible(true));
              }}
            >
              Update
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
        <div className="h-[46px] px-4 flex items-center bg-[#FAFAFA] border-b border-[#CCCCCC80]">
          <span className="text-[14px] font-[500] text-[#333333]">Billing Details</span>
        </div>
        <div className="divide-y divide-[#CCCCCC80]">
          <div className="px-4 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-[13px] text-[#333333]/70">Company Legal Name</div>
              <div className="text-[13px] text-[#333333]">Acme Limited</div>
            </div>
            <Button
              variant="contained"
              sx={primaryButtonSx}
              onClick={() => {
                setIsCompanyModalOpen(true);
                setShowCompanyErrors(false);
                requestAnimationFrame(() => setIsCompanyModalVisible(true));
              }}
            >
              Update
            </Button>
          </div>
          <div className="px-4 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-[13px] text-[#333333]/70">Billing Email</div>
              <div className="text-[13px] text-[#333333]/70">Not available</div>
            </div>
            <Button
              variant="contained"
              sx={primaryButtonSx}
              onClick={() => {
                setIsBillingEmailModalOpen(true);
                setShowBillingEmailErrors(false);
                requestAnimationFrame(() => setIsBillingEmailModalVisible(true));
              }}
            >
              Update
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="outlined" sx={outlineButtonSx}>Cancel</Button>
        <Button variant="contained" sx={primaryButtonSx}>Subscribe</Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-end gap-3 mb-4">
        <span className="rounded-[4px] bg-[#2FB344] px-4 py-2 text-[12px] font-[500] text-white">
          Active
        </span>
        <span className="rounded-[4px] bg-[#F06B61] px-4 py-2 text-[12px] font-[500] text-white">
          Cancel Subscription
        </span>
        {/* <Button variant="contained" sx={dangerButtonSx}>Cancel Subscription</Button> */}
      </div>

      <TabsComponent
        tabs={[
          { label: "Subscription", value: "subscription", content: subscriptionContent },
          { label: "Billing", value: "billing", content: billingContent },
        ]}
      />

      {isTransferModalOpen && (
        <div
          className={[
            "fixed inset-0 z-[2200] flex items-center justify-center bg-[#00000066] transition-opacity duration-300",
            isTransferModalVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div
            className={[
              "w-[90vw] max-w-[700px] rounded-[6px] bg-white shadow-[0px_10px_30px_0px_#00000024] transition-transform duration-300 ease-out",
              isTransferModalVisible ? "translate-y-0" : "translate-y-4",
            ].join(" ")}
          >
            <div className="h-[52px] px-5 border-b border-[#CCCCCC80] flex items-center justify-between">
              <span className="text-[16px] font-[500] text-[#333333]">Transfer Account Ownership</span>
              <button
                type="button"
                aria-label="Close transfer ownership modal"
                className="inline-flex h-[24px] w-[24px] items-center justify-center text-[#666666] hover:text-[#333333]"
                onClick={() => {
                  setIsTransferModalVisible(false);
                  window.setTimeout(() => setIsTransferModalOpen(false), 300);
                }}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
                <div className="h-[46px] px-4 flex items-center bg-[#FAFAFA] border-b border-[#CCCCCC80]">
                  <span className="text-[14px] font-[500] text-[#333333]">Current Account Owner</span>
                </div>
                <div className="px-4 py-4 text-[13px] text-[#333333] border-b border-[#CCCCCC80]">
                  <div className="font-[500]">John Doe</div>
                  <div className="text-[#333333]/70 mt-1">john.doe@example.com</div>
                </div>
                <div className="h-[46px] px-4 flex items-center bg-[#FAFAFA] border-b border-[#CCCCCC80]">
                  <span className="text-[14px] font-[500] text-[#333333]">New Account Owner</span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={fieldWrapperWithErrorClass}>
                      <label className="text-[13px] text-[#333333]/70">Account Owner</label>
                      <input
                        className={fieldInputClass}
                        placeholder="Add Name"
                        value={transferOwnerName}
                        onChange={(event) => setTransferOwnerName(event.target.value)}
                      />
                      {showTransferErrors && transferOwnerName.trim() === "" && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E4554A]">Required field</span>
                      )}
                    </div>
                    <div className={fieldWrapperWithErrorClass}>
                      <label className="text-[13px] text-[#333333]/70">Email</label>
                      <input
                        className={fieldInputClass}
                        placeholder="Add Email"
                        value={transferOwnerEmail}
                        onChange={(event) => setTransferOwnerEmail(event.target.value)}
                      />
                      {showTransferErrors && transferOwnerEmail.trim() === "" && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E4554A]">Required field</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-3">
                    <Button
                      variant="outlined"
                      sx={outlineButtonSx}
                      onClick={() => {
                        setIsTransferModalVisible(false);
                        window.setTimeout(() => setIsTransferModalOpen(false), 300);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      sx={primaryButtonSx}
                      onClick={() => setShowTransferErrors(true)}
                    >
                      Transfer Ownership
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isUpgradeModalOpen && (
        <div
          className={[
            "fixed inset-0 z-[2200] flex items-center justify-center bg-[#00000066] transition-opacity duration-300",
            isUpgradeModalVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div
            className={[
              "w-[90vw] max-w-[700px] rounded-[6px] bg-white shadow-[0px_10px_30px_0px_#00000024] transition-transform duration-300 ease-out",
              isUpgradeModalVisible ? "translate-y-0" : "translate-y-4",
            ].join(" ")}
          >
            <div className="h-[52px] px-5 border-b border-[#CCCCCC80] flex items-center justify-between">
              <span className="text-[16px] font-[500] text-[#333333]">Upgrade Subscription Plan</span>
              <button
                type="button"
                aria-label="Close upgrade plan modal"
                className="inline-flex h-[24px] w-[24px] items-center justify-center text-[#666666] hover:text-[#333333]"
                onClick={() => {
                  setIsUpgradeModalVisible(false);
                  window.setTimeout(() => setIsUpgradeModalOpen(false), 300);
                }}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
                <div className="h-[46px] px-4 flex items-center justify-between bg-[#FAFAFA] border-b border-[#CCCCCC80]">
                  <span className="text-[14px] font-[500] text-[#333333]">Pricing Plan</span>
                  <div className="h-[32px] px-3 rounded-[4px] border border-[#CCCCCC80] text-[12px] text-[#333333] flex items-center">
                    Currency: USD
                  </div>
                </div>

                <div className="divide-y divide-[#CCCCCC80]">
                  <div className="px-4 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="text-[14px] font-[500] text-[#333333]">Starter</div>
                      <button type="button" className="text-[12px] text-[#6E41E2] hover:underline w-fit">Plan Features</button>
                    </div>
                    <div className="text-[14px] text-[#333333]">
                      <span className="text-[18px] font-[600]">$69</span> <span className="text-[12px]">per user / month</span>
                    </div>
                    <span className="rounded-[4px] w-[90px] bg-[#2FB344] px-4 py-2 text-[12px] font-[500] text-white text-center">
                      Active
                    </span>
                  </div>

                  <div className="px-4 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="text-[14px] font-[500] text-[#333333]">Growth</div>
                      <button type="button" className="text-[12px] text-[#6E41E2] hover:underline w-fit">Plan Features</button>
                    </div>
                    <div className="text-[14px] text-[#333333]">
                      <span className="text-[18px] font-[600]">$129</span> <span className="text-[12px]">per user / month</span>
                    </div>
                    <Button variant="contained" sx={popButtonSx}>Upgrade</Button>
                  </div>

                  <div className="px-4 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="text-[14px] font-[500] text-[#333333]">Professional</div>
                      <button type="button" className="text-[12px] text-[#6E41E2] hover:underline w-fit">Plan Features</button>
                    </div>
                    <div className="text-[14px] text-[#333333]">
                      <span className="text-[18px] font-[600]">$249</span> <span className="text-[12px]">per user / month</span>
                    </div>
                    <Button variant="contained" sx={popButtonSx}>Upgrade</Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outlined"
                  sx={outlineButtonSx}
                  onClick={() => {
                    setIsUpgradeModalVisible(false);
                    window.setTimeout(() => setIsUpgradeModalOpen(false), 300);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCompanyModalOpen && (
        <div
          className={[
            "fixed inset-0 z-[2200] flex items-center justify-center bg-[#00000066] transition-opacity duration-300",
            isCompanyModalVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div
            className={[
              "w-[90vw] max-w-[700px] rounded-[6px] bg-white shadow-[0px_10px_30px_0px_#00000024] transition-transform duration-300 ease-out",
              isCompanyModalVisible ? "translate-y-0" : "translate-y-4",
            ].join(" ")}
          >
            <div className="h-[52px] px-5 border-b border-[#CCCCCC80] flex items-center justify-between">
              <span className="text-[16px] font-[500] text-[#333333]">Update Company Legal Name</span>
              <button
                type="button"
                aria-label="Close update company modal"
                className="inline-flex h-[24px] w-[24px] items-center justify-center text-[#666666] hover:text-[#333333]"
                onClick={() => {
                  setIsCompanyModalVisible(false);
                  window.setTimeout(() => setIsCompanyModalOpen(false), 300);
                }}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
                <div className="h-[46px] px-4 flex items-center justify-between bg-[#FAFAFA] border-b border-[#CCCCCC80]">
                  <span className="text-[14px] font-[500] text-[#333333]">Company Name</span>
                  <span className="rounded-[4px] w-[90px] bg-[#2FB344] px-4 py-2 text-[12px] font-[500] text-white text-center">
                    Current
                  </span>
                </div>
                <div className="px-4 py-4 text-[13px] text-[#333333] border-b border-[#CCCCCC80]">
                  <div className="text-[#333333]/70">Acme Corporation Limited</div>
                </div>
                <div className="h-[46px] px-4 flex items-center bg-[#FAFAFA] border-b border-[#CCCCCC80]">
                  <span className="text-[14px] font-[500] text-[#333333]">New Company Name</span>
                </div>
                <div className="p-4">
                  <div className={fieldWrapperWithErrorClass}>
                    <label className="text-[13px] text-[#333333]/70">Company Name</label>
                    <input
                      className={fieldInputClass}
                      placeholder="Add New Company Name"
                      value={newCompanyName}
                      onChange={(event) => setNewCompanyName(event.target.value)}
                    />
                    {showCompanyErrors && newCompanyName.trim() === "" && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E4554A]">Required field</span>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end gap-3">
                    <Button
                      variant="outlined"
                      sx={outlineButtonSx}
                      onClick={() => {
                        setIsCompanyModalVisible(false);
                        window.setTimeout(() => setIsCompanyModalOpen(false), 300);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      sx={primaryButtonSx}
                      onClick={() => setShowCompanyErrors(true)}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isBillingEmailModalOpen && (
        <div
          className={[
            "fixed inset-0 z-[2200] flex items-center justify-center bg-[#00000066] transition-opacity duration-300",
            isBillingEmailModalVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div
            className={[
              "w-[90vw] max-w-[700px] rounded-[6px] bg-white shadow-[0px_10px_30px_0px_#00000024] transition-transform duration-300 ease-out",
              isBillingEmailModalVisible ? "translate-y-0" : "translate-y-4",
            ].join(" ")}
          >
            <div className="h-[52px] px-5 border-b border-[#CCCCCC80] flex items-center justify-between">
              <span className="text-[16px] font-[500] text-[#333333]">Update Billing Email</span>
              <button
                type="button"
                aria-label="Close update billing email modal"
                className="inline-flex h-[24px] w-[24px] items-center justify-center text-[#666666] hover:text-[#333333]"
                onClick={() => {
                  setIsBillingEmailModalVisible(false);
                  window.setTimeout(() => setIsBillingEmailModalOpen(false), 300);
                }}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
                <div className="h-[46px] px-4 flex items-center bg-[#FAFAFA] border-b border-[#CCCCCC80]">
                  <span className="text-[14px] font-[500] text-[#333333]">Billing Email</span>
                </div>
                <div className="px-4 py-4 text-[13px] text-[#333333] border-b border-[#CCCCCC80]">
                  <div className="text-[#333333]/70">Not available</div>
                </div>
                <div className="h-[46px] px-4 flex items-center bg-[#FAFAFA] border-b border-[#CCCCCC80]">
                  <span className="text-[14px] font-[500] text-[#333333]">New Billing Email</span>
                </div>
                <div className="p-4">
                  <div className={fieldWrapperWithErrorClass}>
                    <label className="text-[13px] text-[#333333]/70">Email</label>
                    <input
                      className={fieldInputClass}
                      placeholder="Add Billing Email"
                      value={billingEmail}
                      onChange={(event) => setBillingEmail(event.target.value)}
                    />
                    {showBillingEmailErrors && billingEmail.trim() === "" && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E4554A]">Required field</span>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end gap-3">
                    <Button
                      variant="outlined"
                      sx={outlineButtonSx}
                      onClick={() => {
                        setIsBillingEmailModalVisible(false);
                        window.setTimeout(() => setIsBillingEmailModalOpen(false), 300);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      sx={popButtonSx}
                      onClick={() => setShowBillingEmailErrors(true)}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCardModalOpen && (
        <div
          className={[
            "fixed inset-0 z-[2200] flex items-center justify-center bg-[#00000066] transition-opacity duration-300",
            isCardModalVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div
            className={[
              "w-[90vw] max-w-[900px] rounded-[6px] bg-white shadow-[0px_10px_30px_0px_#00000024] transition-transform duration-300 ease-out",
              isCardModalVisible ? "translate-y-0" : "translate-y-4",
            ].join(" ")}
          >
            <div className="h-[52px] px-5 border-b border-[#CCCCCC80] flex items-center justify-between">
              <span className="text-[16px] font-[500] text-[#333333]">Update Credit Card Details</span>
              <button
                type="button"
                aria-label="Close update card modal"
                className="inline-flex h-[24px] w-[24px] items-center justify-center text-[#666666] hover:text-[#333333]"
                onClick={() => {
                  setIsCardModalVisible(false);
                  window.setTimeout(() => setIsCardModalOpen(false), 300);
                }}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
                <div className="h-[46px] px-4 flex items-center bg-[#FAFAFA] border-b border-[#CCCCCC80]">
                  <span className="text-[14px] font-[500] text-[#333333]">Payment Details</span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-[2.2fr_1fr_1fr] gap-4">
                    <div className={fieldWrapperWithErrorClass}>
                      <label className="text-[13px] text-[#333333]/70">Card Number</label>
                      <div className="relative">
                        <input
                          className={fieldInputClass}
                          value={cardNumber}
                          onChange={(event) => setCardNumber(event.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <VisaIcon />
                          <MastercardIcon />
                        </div>
                      </div>
                      {showCardErrors && cardNumber.trim() === "" && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E4554A]">Required field</span>
                      )}
                    </div>
                    <div className={fieldWrapperWithErrorClass}>
                      <label className="text-[13px] text-[#333333]/70">Expiry Date</label>
                      <input
                        className={fieldInputClass}
                        value={cardExpiry}
                        onChange={(event) => setCardExpiry(event.target.value)}
                      />
                      {showCardErrors && cardExpiry.trim() === "" && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E4554A]">Required field</span>
                      )}
                    </div>
                    <div className={fieldWrapperWithErrorClass}>
                      <label className="text-[13px] text-[#333333]/70">Security Code</label>
                      <input
                        className={fieldInputClass}
                        value={cardCvc}
                        onChange={(event) => setCardCvc(event.target.value)}
                      />
                      {showCardErrors && cardCvc.trim() === "" && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E4554A]">Required field</span>
                      )}
                    </div>
                    <div className={fieldWrapperWithErrorClass}>
                      <label className="text-[13px] text-[#333333]/70">Name on the Card</label>
                      <input
                        className={fieldInputClass}
                        value={cardName}
                        onChange={(event) => setCardName(event.target.value)}
                      />
                      {showCardErrors && cardName.trim() === "" && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E4554A]">Required field</span>
                      )}
                    </div>
                    <div className={fieldWrapperWithErrorClass + " md:col-span-2"}>
                      <label className="text-[13px] text-[#333333]/70">Country</label>
                      <div className="relative">
                        <select
                          className={fieldSelectClass}
                          value={cardCountry}
                          onChange={(event) => setCardCountry(event.target.value)}
                        >
                          <option>New Zealand</option>
                          <option>Australia</option>
                          <option>United States</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
                      </div>
                      {showCardErrors && cardCountry.trim() === "" && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E4554A]">Required field</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-[12px] text-[#333333]/70">
                    By providing your card information, you allow Pathfinder ATS CRM to charge your card for future payments in accordance with their terms.
                  </div>
                  <div className="mt-4 flex justify-end gap-3">
                    <Button
                      variant="outlined"
                      sx={outlineButtonSx}
                      onClick={() => {
                        setIsCardModalVisible(false);
                        window.setTimeout(() => setIsCardModalOpen(false), 300);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      sx={popButtonSx}
                      onClick={() => setShowCardErrors(true)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
