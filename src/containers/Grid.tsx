import { BaseSyntheticEvent, useState, useEffect } from "react";
import { ProjectModel } from "../models/ProjectModel";
import { FaMagnifyingGlass, FaCircleXmark } from "react-icons/fa6";

function Grid({
  projectList,
  showMultiSelect = false,
  showFilter,
  onGridLocalProjectListChange,
  onGridSelectedProjectListChange,
  localProjectList, // list shown to user
  selectedGridItems, // selected from localProjectList
}: {
  projectList: ProjectModel[] | null;
  showMultiSelect?: boolean;
  showFilter: boolean;
  onGridLocalProjectListChange: (state: ProjectModel[]) => void;
  onGridSelectedProjectListChange: (state: ProjectModel[]) => void;
  localProjectList: ProjectModel[];
  selectedGridItems: ProjectModel[];
}) {
  // let originalProjectList = [] as ProjectModel[];
  // let localProjectList = [] as ProjectModel[];
  // all data
  const [originalProjectList, setOriginalProjectList] = useState(
    [] as ProjectModel[]
  );

  const [isShowingFilter, setIsShowingFilter] = useState(false);

  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    if (projectList) {
      projectList.sort((row1, row2) => {
        const row1Name = row1.project_name;
        const row2Name = row2.project_name;
        if (row1Name < row2Name) return -1;
        if (row1Name > row2Name) return 1;
        return 0;
      });
      onGridSelectedProjectListChange([] as ProjectModel[]);
      setOriginalProjectList([...projectList]);
      onGridLocalProjectListChange([...projectList]);

      resetState();
    }
  }, [projectList]);

  useEffect(() => {
    const doFilter = setTimeout(() => {
      if (searchFilter == null || searchFilter.trim() === "") {
        onGridLocalProjectListChange([...originalProjectList]);
      } else {
        onGridLocalProjectListChange([
          ...originalProjectList.filter((el) =>
            el.project_name.toLowerCase().includes(searchFilter.toLowerCase())
          ),
        ]);
      }
      onGridSelectedProjectListChange([...[]]);
    }, 1000);

    return () => clearTimeout(doFilter);
  }, [searchFilter]);

  const resetState = () => {
    setIsShowingFilter(false);
    setSearchFilter("");
  };

  const handleIsSelectedChange = (
    event: BaseSyntheticEvent,
    row_data: ProjectModel
  ) => {
    let currentSelectedGridItems = [...selectedGridItems];
    if (event.target.checked === true) {
      currentSelectedGridItems = [...currentSelectedGridItems, row_data];
      onGridSelectedProjectListChange(currentSelectedGridItems);
    } else {
      currentSelectedGridItems = currentSelectedGridItems.filter(
        (el) => el.project_id !== row_data.project_id
      );
      onGridSelectedProjectListChange(currentSelectedGridItems);
    }
  };

  const handleIsSelectedAllChange = (event: BaseSyntheticEvent) => {
    onGridSelectedProjectListChange([...([] as ProjectModel[])]);
    if (event.target.checked === true) {
      onGridSelectedProjectListChange([...localProjectList]);
    }
  };

  const getRowSelectedStatus = (row: ProjectModel) => {
    const data = selectedGridItems.find(
      (el) => el.project_id === row.project_id
    );
    return data != null;
  };

  const getIsCheckedAll = (): boolean => {
    return (
      localProjectList &&
      localProjectList.length > 0 &&
      localProjectList.length === selectedGridItems.length
    );
  };

  const onHeaderClick = (): void => {
    setIsShowingFilter((prevVal) => !prevVal);
  };

  const onSearchFilterKeyUp = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchFilter(e.target?.value ?? "");
  };

  return (
    <div className="overflow-x-auto overflow-y-auto">
      <table className="table table-pin-rows">
        <thead>
          <tr className="bg-indigo-600">
            {showMultiSelect && (
              <th className="w-0">
                <div className="w-full">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-accent"
                    checked={getIsCheckedAll()}
                    onChange={(e) => handleIsSelectedAllChange(e)}
                  />
                </div>
              </th>
            )}
            <th className="text-lg text-primary-content">
              <div className="flex flex-col">
                <div className="flex flex-row items-center">
                  <span className="mr-2">Project Name</span>{" "}
                  {showFilter === true && (
                    <div className="mr-2 w-full flex flex-row">
                      <button className="mr-2" onClick={onHeaderClick}>
                        {isShowingFilter === true ? (
                          <FaCircleXmark />
                        ) : (
                          <FaMagnifyingGlass />
                        )}
                      </button>
                      {!(searchFilter == null || searchFilter.trim() === "") ? (
                        <p>Filter applied</p>
                      ) : null}
                    </div>
                  )}
                </div>
                {isShowingFilter === true && (
                  <h1 className="flex-1">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Insert search filter</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Search filter"
                        className="input input-bordered w-full"
                        value={searchFilter}
                        onChange={(e) => onSearchFilterKeyUp(e)}
                      />
                    </div>
                  </h1>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {localProjectList?.map((row) => {
            const isRowSelected = getRowSelectedStatus(row);
            return (
              <tr key={row.project_id} className="hover">
                {showMultiSelect && (
                  <td className="object-center">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-accent"
                      checked={isRowSelected}
                      onChange={(e) => {
                        handleIsSelectedChange(e, row);
                      }}
                    />
                  </td>
                )}
                <td>{row.project_name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Grid;
