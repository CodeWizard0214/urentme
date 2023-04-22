import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { AiOutlineBank, AiOutlineCheck, AiOutlineClose, AiOutlineDelete, AiOutlineEye, AiOutlineKey, AiOutlineMail, AiOutlineQuestionCircle, AiOutlineUnorderedList } from 'react-icons/ai';
import { FiEdit, FiMoreVertical } from 'react-icons/fi';
import { IoImagesOutline } from 'react-icons/io5';

const MAX_MENU_COUNT = 5;

const MoreMenu = (props) => {
  const { id, menus, customMenus, menuIds } = props;
  const isMobile = useMediaQuery({ query: `(max-width: 767px)` });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!!menuIds) {
      setCount(menus ? menus.length : 0 + menuIds.length);
    } else {
      setCount(menus ? menus.length : 0);
    }
  }, [menus, menuIds]);

  const onMenuClick = (menu, id) => {
    if (menu?.func) {
      menu.func(id);
    }
  }

  const renderMenuItem = (menu, showLabel) => {
    return (
      <div className="d-flex align-items-center hand" onClick={() => onMenuClick(menu, id)}>
        {menu?.icon === 'edit' ? (
          <FiEdit className="fs-1p25 dark-gray" title={`${showLabel ? "" : menu?.label}`} />
        ) : menu?.icon === 'delete' ? (
          <AiOutlineDelete className="fs-1p25 dark-gray" title={`${showLabel ? "" : menu?.label}`} />
        ) : menu?.icon === 'view' ? (
          <AiOutlineEye className="fs-1p25 dark-gray" title={`${showLabel ? "" : menu?.label}`} />
        ) : menu?.icon === 'password' ? (
          <AiOutlineKey className="fs-1p25 dark-gray" title={`${showLabel ? "" : menu?.label}`} />
        ) : menu?.icon === 'email' ? (
          <AiOutlineMail className="fs-1p25 dark-gray" title={`${showLabel ? "" : menu?.label}`} />
        ) : menu?.icon === 'check' ? (
          <AiOutlineCheck className="fs-1p25 dark-gray" title={`${showLabel ? "" : menu?.label}`} />
        ) : menu?.icon === 'close' ? (
          <AiOutlineClose className="fs-1p25 dark-gray" title={`${showLabel ? "" : menu?.label}`} />
        ) : menu?.icon === 'image' ? (
          <IoImagesOutline className="fs-1p25 dark-gray" title={`${showLabel ? "" : menu?.label}`} />
        ) : menu?.icon === 'feature' ? (
          <AiOutlineUnorderedList className="fs-1p25 dark-gray" title={`${showLabel ? "" : menu?.label}`} />
        ) : menu?.icon === 'bank' ? (
          <AiOutlineBank className="fs-1p25 dark-gray" title={`${showLabel ? "" : menu?.label}`} />
        ) : menu?.icon !== 'none' ? (
          <AiOutlineQuestionCircle className="fs-1p25 dark-gray" title={`${showLabel ? "" : menu?.label}`} />
        ) : (
          <></>
        )}
        {showLabel && (
          <span className="fw-400 fs-0p875 cod-gray ms-2">{menu?.label}</span>
        )}
      </div>
    );
  }

  return (
    <>
      {isMobile || count > MAX_MENU_COUNT || !menus ? (
        <UncontrolledDropdown>
          <DropdownToggle nav className="text-end">
            <FiMoreVertical className="cod-gray" />
          </DropdownToggle>
          <DropdownMenu>
            {customMenus?.length > 0 && menuIds?.length > 0 && menuIds.map(id => (
              <DropdownItem key={`${id}-menu-${customMenus[id].icon}`}>{renderMenuItem(customMenus[id], true)}</DropdownItem>
            ))}
            {menus?.length > 0 && menus.map(menu => (
              <DropdownItem key={`${id}-menu-${menu.icon}`}>{renderMenuItem(menu, true)}</DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      ) : (
        <div className="d-flex align-items-center gap-2">
          {customMenus?.length > 0 && menuIds?.length > 0 && menuIds.map((id, idx) => (
            <div key={`${id}-menu-${idx}`}>{renderMenuItem(customMenus[id], false)}</div>
          ))}
          {menus?.length > 0 && menus.map(menu => (
            <div key={`${id}-menu-${menu.icon}`}>{renderMenuItem(menu, false)}</div>
          ))}
        </div>
      )}
    </>
  );
};

export default MoreMenu;
