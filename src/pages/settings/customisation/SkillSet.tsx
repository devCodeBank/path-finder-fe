import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Button, Tooltip } from "@mui/material";
import React, { useState } from "react";
import TrashIcon from "@/components/icons/TrashIcon";
import CloseXIcon from "@assets/icons/x.svg";

type SkillCategory = {
  id: string;
  title: string;
  skills: string[];
};

const initialCategories: SkillCategory[] = [
  {
    id: "frontend-development",
    title: "Frontend Development",
    skills: ["React", "Vue", "Tailwind", "TypeScript"]
  },
  {
    id: "backend-development",
    title: "Backend Development",
    skills: ["Node.js", "Python", "PostgreSQL", "Redis"]
  },
  {
    id: "soft-skills",
    title: "Soft Skills",
    skills: ["Leadership", "Communication"]
  }
];

const tooltipProps = {
  tooltip: { sx: { bgcolor: "#797979" } },
  arrow: { sx: { color: "#797979" } },
  popper: { sx: { zIndex: 2400 } }
} as const;

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

const SkillSet: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategory[]>(initialCategories);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingSkillFor, setAddingSkillFor] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [searchOpenByCategory, setSearchOpenByCategory] = useState<Record<string, boolean>>({});
  const [searchByCategory, setSearchByCategory] = useState<Record<string, string>>({});
  const [selectedSkill, setSelectedSkill] = useState<{ categoryId: string; index: number } | null>(null);

  const closeAddCategory = () => {
    setIsAddCategoryOpen(false);
    setNewCategoryName("");
  };

  const saveAddCategory = () => {
    const next = newCategoryName.trim();
    if (!next) return;
    setCategories((prev) => ([
      ...prev,
      {
        id: `${next.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        title: next,
        skills: []
      }
    ]));
    closeAddCategory();
  };

  const openAddSkill = (categoryId: string) => {
    setAddingSkillFor(categoryId);
    setNewSkillName("");
  };

  const closeAddSkill = () => {
    setAddingSkillFor(null);
    setNewSkillName("");
  };

  const saveAddSkill = () => {
    if (!addingSkillFor) return;
    const next = newSkillName.trim();
    if (!next) return;
    setCategories((prev) =>
      prev.map((category) =>
        category.id === addingSkillFor
          ? { ...category, skills: [...category.skills, next] }
          : category
      )
    );
    closeAddSkill();
  };

  const openEditCategory = (category: SkillCategory) => {
    setEditingCategory(category);
    setEditingCategoryName(category.title);
  };

  const closeEditCategory = () => {
    setEditingCategory(null);
    setEditingCategoryName("");
  };

  const saveEditCategory = () => {
    if (!editingCategory) return;
    const next = editingCategoryName.trim();
    if (!next) return;
    setCategories((prev) =>
      prev.map((category) =>
        category.id === editingCategory.id ? { ...category, title: next } : category
      )
    );
    closeEditCategory();
  };

  const removeCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== categoryId));
    if (addingSkillFor === categoryId) {
      closeAddSkill();
    }
  };

  const toggleSearch = (categoryId: string) => {
    setSearchOpenByCategory((prev) => {
      const nextOpen = !prev[categoryId];
      if (!nextOpen) {
        setSearchByCategory((s) => ({ ...s, [categoryId]: "" }));
      }
      return { ...prev, [categoryId]: nextOpen };
    });
  };

  const removeSkill = (categoryId: string, index: number) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, skills: category.skills.filter((_, skillIndex) => skillIndex !== index) }
          : category
      )
    );
    setSelectedSkill((prev) =>
      prev && prev.categoryId === categoryId && prev.index === index ? null : prev
    );
  };

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex items-center justify-end">
        <Button
          variant="contained"
          sx={primaryButtonSx}
          startIcon={<AddIcon />}
          onClick={() => setIsAddCategoryOpen(true)}
        >
          Skill Category
        </Button>
      </div>

      <div className="bg-white border border-[#CCCCCC80] rounded-[6px] p-4">
        <div className="flex flex-col gap-3">
          {categories.map((category) => {
            const keyword = (searchByCategory[category.id] || "").trim().toLowerCase();
            const skills = category.skills
              .map((skill, index) => ({ skill, index }))
              .filter(({ skill }) => (keyword ? skill.toLowerCase().includes(keyword) : true));

            return (
              <div key={category.id} className="flex flex-col gap-2">
                <div className="h-[54px] px-4 border border-[#CCCCCC80] rounded-[4px] bg-[#EAEAEA26] flex items-center justify-between">
                  <span className="text-[14px] font-[500] text-[#333333]">{category.title}</span>
                  <div className="flex items-center gap-5 text-[#888888]">
                    {searchOpenByCategory[category.id] && (
                      <input
                        type="text"
                        value={searchByCategory[category.id] || ""}
                        onChange={(event) =>
                          setSearchByCategory((prev) => ({ ...prev, [category.id]: event.target.value }))
                        }
                        placeholder="Search skill"
                        className="h-[30px] w-[180px] rounded-[4px] border border-[#333333] px-2 text-[12px] text-[#333333] focus:border-[#333333] focus:outline-none"
                      />
                    )}
                    <Tooltip title="Search" arrow placement="bottom" componentsProps={tooltipProps}>
                      <button type="button" onClick={() => toggleSearch(category.id)}>
                        <SearchOutlinedIcon sx={{ fontSize: 20 }} />
                      </button>
                    </Tooltip>
                    <Tooltip title="Edit" arrow placement="bottom" componentsProps={tooltipProps}>
                      <button type="button" onClick={() => openEditCategory(category)}>
                        <EditOutlinedIcon sx={{ fontSize: 20 }} />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete" arrow placement="bottom" componentsProps={tooltipProps}>
                      <button type="button" onClick={() => removeCategory(category.id)}>
                        <TrashIcon size={20} />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {skills.map(({ skill, index }) => (
                    <div
                      key={`${category.id}-${skill}-${index}`}
                      className="h-[52px] px-4 border border-[#CCCCCC80] rounded-[4px] bg-white text-[13px] text-[#333333] flex items-center justify-between cursor-pointer"
                      onClick={() => setSelectedSkill({ categoryId: category.id, index })}
                    >
                      <span>{skill}</span>
                      {selectedSkill?.categoryId === category.id && selectedSkill.index === index && (
                        <button
                          type="button"
                          className="text-[#888888] hover:text-[#666666]"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeSkill(category.id, index);
                          }}
                        >
                          <TrashIcon size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  {addingSkillFor === category.id ? (
                    <div className="h-[52px] px-3 border border-[#CCCCCC80] rounded-[4px] bg-white flex items-center gap-2">
                      <input
                        type="text"
                        value={newSkillName}
                        onChange={(event) => setNewSkillName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") saveAddSkill();
                        }}
                        placeholder="Add new skill"
                        className="h-[32px] w-full rounded-[4px] border border-[#D6D6D6] px-2 text-[13px] text-[#333333] focus:border-[#6E41E2] focus:outline-none"
                      />
                      <button
                        type="button"
                        className="h-[30px] px-3 rounded-[4px] border border-[#CCCCCC80] text-[12px] text-[#333333] hover:bg-[#F3F4F6]"
                        onClick={closeAddSkill}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="h-[30px] px-3 rounded-[4px] bg-[#6E41E2] text-[12px] text-white hover:bg-[#7B52F4]"
                        onClick={saveAddSkill}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="h-[52px] border border-[#CCCCCC80] rounded-[4px] bg-white flex items-center justify-center gap-2 text-[#6E41E2] text-[14px] font-[500]"
                      onClick={() => openAddSkill(category.id)}
                    >
                      <span className="text-[20px] leading-none">+</span>
                      <span className="text-[14px]">Add New Skill</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isAddCategoryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={closeAddCategory}
        >
          <div
            className="w-full max-w-[520px] rounded-[10px] bg-white p-8 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-[600] text-[#333333]">Add Skill Category</div>
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
                  onClick={closeAddCategory}
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
                onClick={closeAddCategory}
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

      {editingCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={closeEditCategory}
        >
          <div
            className="w-full max-w-[520px] rounded-[10px] bg-white p-8 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-[600] text-[#333333]">Edit Skill Category</div>
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
                  onClick={closeEditCategory}
                >
                  <img src={CloseXIcon} alt="" className="h-[15px] w-[15px]" />
                </button>
              </Tooltip>
            </div>
            <div className="mt-6">
              <input
                type="text"
                value={editingCategoryName}
                onChange={(event) => setEditingCategoryName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveEditCategory();
                }}
                className="h-[44px] w-full rounded-[6px] border border-[#D6D6D6] px-4 text-[14px] text-[#333333] focus:border-[#6E41E2] focus:outline-none"
                placeholder="Category name"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="h-[36px] px-5 rounded-[6px] border border-[#CCCCCC80] text-[#333333] text-[12px] font-[500] hover:bg-[#F3F4F6]"
                onClick={closeEditCategory}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-[36px] px-5 rounded-[6px] bg-[#6E41E2] text-white text-[12px] font-[500] hover:bg-[#7B52F4]"
                onClick={saveEditCategory}
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

export default SkillSet;
