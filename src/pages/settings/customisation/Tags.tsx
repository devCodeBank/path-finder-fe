import TabsComponent from "@/components/tabs/TabsComponent";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Button, Checkbox, Tooltip } from "@mui/material";
import React, { useState } from "react";
import TrashIcon from "@/components/icons/TrashIcon";
import CloseXIcon from "@assets/icons/x.svg";

type TabKey = "candidates" | "jobs" | "contacts" | "companies";

type TagItem = {
  id: string;
  label: string;
  visible: boolean;
};

type TagGroup = {
  id: string;
  title: string;
  tags: TagItem[];
};

const initialData: Record<TabKey, TagGroup[]> = {
  candidates: [
    {
      id: "technical-skills",
      title: "Technical Skills",
      tags: [
        { id: "react", label: "React", visible: true },
        { id: "node-js", label: "Node.Js", visible: true }
      ]
    },
    {
      id: "hiring-status",
      title: "Hiring Status",
      tags: [
        { id: "urgent-hire", label: "Urgent Hire", visible: true },
        { id: "blacklisted", label: "Blacklisted", visible: true }
      ]
    }
  ],
  jobs: [
    {
      id: "priority-level",
      title: "Priority Level",
      tags: [
        { id: "high-priority", label: "High Priority", visible: true },
        { id: "low-priority", label: "Low Priority", visible: true }
      ]
    },
    {
      id: "employment-type",
      title: "Employment Type",
      tags: [
        { id: "contract", label: "Contract", visible: true },
        { id: "fixed-term", label: "Fixed Term", visible: true }
      ]
    }
  ],
  contacts: [
    {
      id: "influence-level",
      title: "Influence Level",
      tags: [
        { id: "decision-maker", label: "Decision Maker", visible: true },
        { id: "gatekeeper", label: "Gatekeeper", visible: true }
      ]
    },
    {
      id: "engagement-status",
      title: "Engagement Status",
      tags: [
        { id: "warm-lead", label: "Warm Lead", visible: true },
        { id: "cold-lead", label: "Cold Lead", visible: true }
      ]
    }
  ],
  companies: [
    {
      id: "account-tier",
      title: "Account Tier",
      tags: [
        { id: "tier-1-key-account", label: "Tier 1 (Key Account)", visible: true },
        { id: "tier-3-small", label: "Tier 3 (Small)", visible: true }
      ]
    },
    {
      id: "industry-sector",
      title: "Industry Sector",
      tags: [
        { id: "fintech", label: "FinTech", visible: true },
        { id: "healthtech", label: "HealthTech", visible: true }
      ]
    }
  ]
};

const primaryButtonSx = {
  height: "36px",
  backgroundColor: "#6E41E2",
  textTransform: "none",
  fontSize: "12px",
  fontWeight: 500,
  borderRadius: "4px",
  boxShadow: "none",
  width: "auto",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#7B52F4",
    boxShadow: "none"
  }
};

const Tags: React.FC = () => {
  const [data, setData] = useState<Record<TabKey, TagGroup[]>>(initialData);
  const [activeTab, setActiveTab] = useState<TabKey>("candidates");
  const [editing, setEditing] = useState<{ tab: TabKey; groupId: string } | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [searchOpenByGroup, setSearchOpenByGroup] = useState<Record<string, boolean>>({});
  const [searchByGroup, setSearchByGroup] = useState<Record<string, string>>({});
  const [addingTagFor, setAddingTagFor] = useState<{ tab: TabKey; groupId: string } | null>(null);
  const [newTagLabel, setNewTagLabel] = useState("");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingTag, setEditingTag] = useState<{ tab: TabKey; groupId: string; tagId: string } | null>(null);
  const [editingTagLabel, setEditingTagLabel] = useState("");

  const openEditModal = (tab: TabKey, group: TagGroup) => {
    setEditing({ tab, groupId: group.id });
    setEditingTitle(group.title);
  };

  const closeEditModal = () => {
    setEditing(null);
    setEditingTitle("");
  };

  const saveEditModal = () => {
    if (!editing) return;
    const nextTitle = editingTitle.trim();
    if (!nextTitle) return;
    setData((prev) => ({
      ...prev,
      [editing.tab]: prev[editing.tab].map((group) =>
        group.id === editing.groupId ? { ...group, title: nextTitle } : group
      )
    }));
    closeEditModal();
  };

  const toggleTagVisibility = (tab: TabKey, groupId: string, tagId: string, visible: boolean) => {
    setData((prev) => ({
      ...prev,
      [tab]: prev[tab].map((group) =>
        group.id === groupId
          ? {
            ...group,
            tags: group.tags.map((tag) => (tag.id === tagId ? { ...tag, visible } : tag))
          }
          : group
      )
    }));
  };

  const toggleSearch = (groupId: string) => {
    setSearchOpenByGroup((prev) => {
      const nextOpen = !prev[groupId];
      if (!nextOpen) {
        setSearchByGroup((prevSearch) => ({ ...prevSearch, [groupId]: "" }));
      }
      return { ...prev, [groupId]: nextOpen };
    });
  };

  const openAddTag = (tab: TabKey, groupId: string) => {
    setAddingTagFor({ tab, groupId });
    setNewTagLabel("");
  };

  const cancelAddTag = () => {
    setAddingTagFor(null);
    setNewTagLabel("");
  };

  const saveAddTag = () => {
    if (!addingTagFor) return;
    const next = newTagLabel.trim();
    if (!next) return;
    setData((prev) => ({
      ...prev,
      [addingTagFor.tab]: prev[addingTagFor.tab].map((group) =>
        group.id === addingTagFor.groupId
          ? {
            ...group,
            tags: [
              ...group.tags,
              {
                id: `${next.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
                label: next,
                visible: true
              }
            ]
          }
          : group
      )
    }));
    cancelAddTag();
  };

  const closeAddCategoryModal = () => {
    setIsAddCategoryOpen(false);
    setNewCategoryName("");
  };

  const saveAddCategory = () => {
    const next = newCategoryName.trim();
    if (!next) return;
    setData((prev) => ({
      ...prev,
      [activeTab]: [
        ...prev[activeTab],
        {
          id: `${activeTab}-${next.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
          title: next,
          tags: []
        }
      ]
    }));
    closeAddCategoryModal();
  };

  const moveTagToGroup = (tab: TabKey, sourceGroupId: string, tagId: string, targetGroupId: string) => {
    if (sourceGroupId === targetGroupId) return;
    setData((prev) => {
      let movingTag: TagItem | null = null;
      const removed = prev[tab].map((group) => {
        if (group.id !== sourceGroupId) return group;
        const nextTags = group.tags.filter((tag) => {
          if (tag.id === tagId) {
            movingTag = tag;
            return false;
          }
          return true;
        });
        return { ...group, tags: nextTags };
      });
      if (!movingTag) return prev;
      return {
        ...prev,
        [tab]: removed.map((group) =>
          group.id === targetGroupId ? { ...group, tags: [...group.tags, movingTag as TagItem] } : group
        )
      };
    });
  };

  const deleteTag = (tab: TabKey, groupId: string, tagId: string) => {
    setData((prev) => ({
      ...prev,
      [tab]: prev[tab].map((group) =>
        group.id === groupId ? { ...group, tags: group.tags.filter((tag) => tag.id !== tagId) } : group
      )
    }));
  };

  const openEditTag = (tab: TabKey, groupId: string, tag: TagItem) => {
    setEditingTag({ tab, groupId, tagId: tag.id });
    setEditingTagLabel(tag.label);
  };

  const closeEditTag = () => {
    setEditingTag(null);
    setEditingTagLabel("");
  };

  const saveEditTag = () => {
    if (!editingTag) return;
    const nextLabel = editingTagLabel.trim();
    if (!nextLabel) return;
    setData((prev) => ({
      ...prev,
      [editingTag.tab]: prev[editingTag.tab].map((group) =>
        group.id === editingTag.groupId
          ? {
            ...group,
            tags: group.tags.map((tag) =>
              tag.id === editingTag.tagId ? { ...tag, label: nextLabel } : tag
            )
          }
          : group
      )
    }));
    closeEditTag();
  };

  const renderTabContent = (tab: TabKey) => (
    <div className="border border-[#CCCCCC80] rounded-[6px] p-4">
      <div className="flex flex-col gap-3">
        {data[tab].map((group) => (
          <div key={group.id} className="flex flex-col gap-2">
            <div className="h-[54px] px-4 border border-[#CCCCCC80] rounded-[4px] bg-[#EAEAEA26] flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[14px] font-[500] text-[#333333] truncate">{group.title}</span>
              </div>
              <div className="flex items-center gap-6 text-[#888888]">
                {searchOpenByGroup[group.id] && (
                  <input
                    type="text"
                    value={searchByGroup[group.id] || ""}
                    onChange={(event) =>
                      setSearchByGroup((prev) => ({ ...prev, [group.id]: event.target.value }))
                    }
                    placeholder="Search tag"
                    className="h-[30px] w-[180px] rounded-[4px] border border-[#D6D6D6] px-2 text-[12px] text-[#333333] focus:border-[#333333] focus:outline-none"
                  />
                )}
                <Tooltip
                  title="Search"
                  arrow
                  placement="left"
                  componentsProps={{
                    tooltip: { sx: { bgcolor: "#797979" } },
                    arrow: { sx: { color: "#797979" } },
                    popper: { sx: { zIndex: 2400 } }
                  }}
                >
                  <button
                    type="button"
                    className="hover:text-[#666666]"
                    onClick={() => toggleSearch(group.id)}
                  >
                    <SearchOutlinedIcon sx={{ fontSize: 20 }} />
                  </button>
                </Tooltip>
                <Tooltip
                  title="Edit"
                  arrow
                  placement="left"
                  componentsProps={{
                    tooltip: { sx: { bgcolor: "#797979" } },
                    arrow: { sx: { color: "#797979" } },
                    popper: { sx: { zIndex: 2400 } }
                  }}
                >
                  <button
                    type="button"
                    className="hover:text-[#666666]"
                    onClick={() => openEditModal(tab, group)}
                  >
                    <EditOutlinedIcon sx={{ fontSize: 20 }} />
                  </button>
                </Tooltip>
                <Tooltip
                  title="Delete"
                  arrow
                  placement="left"
                  componentsProps={{
                    tooltip: { sx: { bgcolor: "#797979" } },
                    arrow: { sx: { color: "#797979" } },
                    popper: { sx: { zIndex: 2400 } }
                  }}
                >
                  <button type="button" className="hover:text-[#666666]">
                    <TrashIcon size={20} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {group.tags
              .filter((tag) => {
                const keyword = (searchByGroup[group.id] || "").trim().toLowerCase();
                if (!keyword) return true;
                return tag.label.toLowerCase().includes(keyword);
              })
              .map((tag) => (
                (() => {
                  return (
                    <div
                      key={tag.id}
                      className="group h-[54px] px-4 border border-[#CCCCCC80] rounded-[4px] bg-white flex items-center justify-between"
                      data-tag-row="true"
                    >
                      <div className="flex items-center gap-3">
                        <LocalOfferOutlinedIcon sx={{ fontSize: 22, color: "#7A7A7A" }} />
                        <span className="text-[13px] text-[#333333]">{tag.label}</span>
                      </div>
                      <div className="hidden items-center gap-5 group-hover:flex">
                        <div className="relative">
                          <select
                            value={group.id}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) => moveTagToGroup(tab, group.id, tag.id, event.target.value)}
                            className="h-[30px] min-w-[140px] rounded-[4px] border border-[#D6D6D6] pl-2 pr-8 text-[12px] text-[#666666] bg-white appearance-none focus:border-[#6E41E2] focus:outline-none"
                          >
                            <option value={group.id}>Move to...</option>
                            {data[tab]
                              .filter((g) => g.id !== group.id)
                              .map((g) => (
                                <option key={g.id} value={g.id}>
                                  {g.title}
                                </option>
                              ))}
                          </select>
                          <svg
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                            width="14"
                            height="14"
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M6 8L10 12L14 8"
                              stroke="#666666"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                          <button
                            type="button"
                            className="text-[#888888] hover:text-[#666666]"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEditTag(tab, group.id, tag);
                            }}
                          >
                            <EditOutlinedIcon sx={{ fontSize: 19 }} />
                          </button>
                          <button
                            type="button"
                            className="text-[#888888] hover:text-[#666666]"
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteTag(tab, group.id, tag.id);
                            }}
                          >
                            <TrashIcon size={19} />
                          </button>
                        </div>
                      <div className="flex items-center gap-12">
                        <span className="text-[13px] text-[#333333]">Tag Visibility</span>
                        <Checkbox
                          checked={tag.visible}
                          onChange={(event) => toggleTagVisibility(tab, group.id, tag.id, event.target.checked)}
                          sx={{
                            p: 0,
                            color: "#57CC4D",
                            "&.Mui-checked": { color: "#57CC4D" },
                          }}
                        />
                      </div>
                    </div>
                  );
                })()
              ))}

            {addingTagFor?.tab === tab && addingTagFor.groupId === group.id ? (
              <div className="h-[54px] px-4 border border-[#CCCCCC80] rounded-[4px] bg-white flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={newTagLabel}
                  onChange={(event) => setNewTagLabel(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") saveAddTag();
                  }}
                  placeholder="Add new tag"
                  className="h-[32px] w-full rounded-[4px] border border-[#D6D6D6] px-3 text-[13px] text-[#333333] focus:border-[#6E41E2] focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-[30px] px-3 rounded-[4px] border border-[#CCCCCC80] text-[12px] text-[#333333] hover:bg-[#F3F4F6]"
                    onClick={cancelAddTag}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="h-[30px] px-3 rounded-[4px] bg-[#6E41E2] text-[12px] text-white hover:bg-[#7B52F4]"
                    onClick={saveAddTag}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="h-[54px] px-4 border border-[#CCCCCC80] rounded-[4px] bg-white flex items-center justify-center gap-2 text-[#6E41E2] text-[14px] font-[500]"
                onClick={() => openAddTag(tab, group.id)}
              >
                <span className="text-[20px] leading-none">+</span>
                Add New Tag
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { label: "Candidates", value: "candidates", content: renderTabContent("candidates") },
    { label: "Jobs", value: "jobs", content: renderTabContent("jobs") },
    { label: "Contacts", value: "contacts", content: renderTabContent("contacts") },
    { label: "Companies", value: "companies", content: renderTabContent("companies") }
  ];

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex items-center justify-end">
        <Button
          variant="contained"
          sx={primaryButtonSx}
          startIcon={<AddIcon />}
          onClick={() => setIsAddCategoryOpen(true)}
        >
          Tag Category
        </Button>
      </div>

      <div className="bg-white border border-[#CCCCCC80] rounded-[6px] overflow-hidden p-4">
        <TabsComponent
          tabs={tabs}
          defaultTab="candidates"
          value={activeTab}
          onChange={(value) => setActiveTab(value as TabKey)}
        />
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={closeEditModal}
        >
          <div
            className="w-full max-w-[520px] rounded-[10px] bg-white p-8 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-[600] text-[#333333]">Edit Section Name</div>
              <Tooltip
                title="Close"
                arrow
                componentsProps={{
                  tooltip: { sx: { bgcolor: "#797979" } },
                  arrow: { sx: { color: "#797979" } },
                  popper: { sx: { zIndex: 2400 } }
                }}
              >
                <button
                  type="button"
                  aria-label="Close"
                  className="inline-flex h-[24px] w-[24px] items-center justify-center transition-opacity hover:opacity-80"
                  onClick={closeEditModal}
                >
                  <img src={CloseXIcon} alt="" className="h-[15px] w-[15px]" />
                </button>
              </Tooltip>
            </div>
            <div className="mt-6">
              <input
                type="text"
                value={editingTitle}
                onChange={(event) => setEditingTitle(event.target.value)}
                className="h-[44px] w-full rounded-[6px] border border-[#D6D6D6] px-4 text-[14px] text-[#333333] focus:border-[#6E41E2] focus:outline-none"
                placeholder="Section name"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="h-[36px] px-5 rounded-[6px] bg-[#6E41E2] text-white text-[12px] font-[500] hover:bg-[#7B52F4]"
                onClick={saveEditModal}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddCategoryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={closeAddCategoryModal}
        >
          <div
            className="w-full max-w-[520px] rounded-[10px] bg-white p-8 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-[600] text-[#333333]">Add Tag Category</div>
              <Tooltip
                title="Close"
                arrow
                componentsProps={{
                  tooltip: { sx: { bgcolor: "#797979" } },
                  arrow: { sx: { color: "#797979" } },
                  popper: { sx: { zIndex: 2400 } }
                }}
              >
                <button
                  type="button"
                  aria-label="Close"
                  className="inline-flex h-[24px] w-[24px] items-center justify-center transition-opacity hover:opacity-80"
                  onClick={closeAddCategoryModal}
                >
                  <img src={CloseXIcon} alt="" className="h-[15px] w-[15px]" />
                </button>
              </Tooltip>
            </div>
            <div className="mt-6">
              <input
                type="text"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveAddCategory();
                }}
                className="h-[44px] w-full rounded-[6px] border border-[#D6D6D6] px-4 text-[14px] text-[#333333] focus:border-[#6E41E2] focus:outline-none"
                placeholder="Category name"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="h-[36px] px-5 rounded-[6px] border border-[#CCCCCC80] text-[#333333] text-[12px] font-[500] hover:bg-[#F3F4F6]"
                onClick={closeAddCategoryModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-[36px] px-5 rounded-[6px] bg-[#6E41E2] text-white text-[12px] font-[500] hover:bg-[#7B52F4]"
                onClick={saveAddCategory}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {editingTag && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={closeEditTag}
        >
          <div
            className="w-full max-w-[520px] rounded-[10px] bg-white p-8 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-[600] text-[#333333]">Edit Tag Name</div>
              <Tooltip
                title="Close"
                arrow
                componentsProps={{
                  tooltip: { sx: { bgcolor: "#797979" } },
                  arrow: { sx: { color: "#797979" } },
                  popper: { sx: { zIndex: 2400 } }
                }}
              >
                <button
                  type="button"
                  aria-label="Close"
                  className="inline-flex h-[24px] w-[24px] items-center justify-center transition-opacity hover:opacity-80"
                  onClick={closeEditTag}
                >
                  <img src={CloseXIcon} alt="" className="h-[15px] w-[15px]" />
                </button>
              </Tooltip>
            </div>
            <div className="mt-6">
              <input
                type="text"
                value={editingTagLabel}
                onChange={(event) => setEditingTagLabel(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveEditTag();
                }}
                className="h-[44px] w-full rounded-[6px] border border-[#D6D6D6] px-4 text-[14px] text-[#333333] focus:border-[#6E41E2] focus:outline-none"
                placeholder="Tag name"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="h-[36px] px-5 rounded-[6px] border border-[#CCCCCC80] text-[#333333] text-[12px] font-[500] hover:bg-[#F3F4F6]"
                onClick={closeEditTag}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-[36px] px-5 rounded-[6px] bg-[#6E41E2] text-white text-[12px] font-[500] hover:bg-[#7B52F4]"
                onClick={saveEditTag}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tags;
