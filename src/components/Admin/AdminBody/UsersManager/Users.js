import { React, useCallback, useMemo, useState } from 'react';
import { subDays, subHours } from 'date-fns';
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { UserSearch } from "./UserSeach";
import { UserTable } from "./UserTable";
import { applyPagination } from '../../../../shared/util/apply-pagination';
import { useSelection } from '../../../../shared/hook/use-selection';
import Modal from 'react-bootstrap/Modal';
import classNames from 'classnames/bind';
import styles from './UserModal.module.scss';

const cx = classNames.bind(styles);
const now = new Date();
const data = [
  {
    id: '5e887ac47eed253091be10cb',
    address: {
      city: 'Cleveland',
      country: 'USA',
      state: 'Ohio',
      street: '2849 Fulton Street'
    },
    avatar: '/assets/avatars/avatar-carson-darrin.png',
    createdAt: subDays(subHours(now, 7), 1).getTime(),
    email: 'carson.darrin@devias.io',
    name: 'Carson Darrin',
    phone: '304-428-3097'
  },
  {
    id: '5e887b209c28ac3dd97f6db5',
    address: {
      city: 'Atlanta',
      country: 'USA',
      state: 'Georgia',
      street: '1865  Pleasant Hill Road'
    },
    avatar: '/assets/avatars/avatar-fran-perez.png',
    createdAt: subDays(subHours(now, 1), 2).getTime(),
    email: 'fran.perez@devias.io',
    name: 'Fran Perez',
    phone: '712-351-5711'
  },
  {
    id: '5e887b7602bdbc4dbb234b27',
    address: {
      city: 'North Canton',
      country: 'USA',
      state: 'Ohio',
      street: '4894  Lakeland Park Drive'
    },
    avatar: '/assets/avatars/avatar-jie-yan-song.png',
    createdAt: subDays(subHours(now, 4), 2).getTime(),
    email: 'jie.yan.song@devias.io',
    name: 'Jie Yan Song',
    phone: '770-635-2682'
  },
  {
    id: '5e86809283e28b96d2d38537',
    address: {
      city: 'Madrid',
      country: 'Spain',
      name: 'Anika Visser',
      street: '4158  Hedge Street'
    },
    avatar: '/assets/avatars/avatar-anika-visser.png',
    createdAt: subDays(subHours(now, 11), 2).getTime(),
    email: 'anika.visser@devias.io',
    name: 'Anika Visser',
    phone: '908-691-3242'
  },
  {
    id: '5e86805e2bafd54f66cc95c3',
    address: {
      city: 'San Diego',
      country: 'USA',
      state: 'California',
      street: '75247'
    },
    avatar: '/assets/avatars/avatar-miron-vitold.png',
    createdAt: subDays(subHours(now, 7), 3).getTime(),
    email: 'miron.vitold@devias.io',
    name: 'Miron Vitold',
    phone: '972-333-4106'
  },
  {
    id: '5e887a1fbefd7938eea9c981',
    address: {
      city: 'Berkeley',
      country: 'USA',
      state: 'California',
      street: '317 Angus Road'
    },
    avatar: '/assets/avatars/avatar-penjani-inyene.png',
    createdAt: subDays(subHours(now, 5), 4).getTime(),
    email: 'penjani.inyene@devias.io',
    name: 'Penjani Inyene',
    phone: '858-602-3409'
  },
  {
    id: '5e887d0b3d090c1b8f162003',
    address: {
      city: 'Carson City',
      country: 'USA',
      state: 'Nevada',
      street: '2188  Armbrester Drive'
    },
    avatar: '/assets/avatars/avatar-omar-darboe.png',
    createdAt: subDays(subHours(now, 15), 4).getTime(),
    email: 'omar.darobe@devias.io',
    name: 'Omar Darobe',
    phone: '415-907-2647'
  },
  {
    id: '5e88792be2d4cfb4bf0971d9',
    address: {
      city: 'Los Angeles',
      country: 'USA',
      state: 'California',
      street: '1798  Hickory Ridge Drive'
    },
    avatar: '/assets/avatars/avatar-siegbert-gottfried.png',
    createdAt: subDays(subHours(now, 2), 5).getTime(),
    email: 'siegbert.gottfried@devias.io',
    name: 'Siegbert Gottfried',
    phone: '702-661-1654'
  },
  {
    id: '5e8877da9a65442b11551975',
    address: {
      city: 'Murray',
      country: 'USA',
      state: 'Utah',
      street: '3934  Wildrose Lane'
    },
    avatar: '/assets/avatars/avatar-iulia-albu.png',
    createdAt: subDays(subHours(now, 8), 6).getTime(),
    email: 'iulia.albu@devias.io',
    name: 'Iulia Albu',
    phone: '313-812-8947'
  },
  {
    id: '5e8680e60cba5019c5ca6fda',
    address: {
      city: 'Salt Lake City',
      country: 'USA',
      state: 'Utah',
      street: '368 Lamberts Branch Road'
    },
    avatar: '/assets/avatars/avatar-nasimiyu-danai.png',
    createdAt: subDays(subHours(now, 1), 9).getTime(),
    email: 'nasimiyu.danai@devias.io',
    name: 'Nasimiyu Danai',
    phone: '801-301-7894'
  }
];

const useUsers = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useUserIds = (users) => {
  return useMemo(
    () => {
      return users.map((user) => user.id);
    },
    [users]
  );
};


const UsersManage = () => {
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const users = useUsers(page, rowsPerPage);
  const usersIds = useUserIds(users);
  const usersSelection = useSelection(usersIds);

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );
  

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Users
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <VerticalAlignBottomOutlinedIcon />
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  onClick={() => setVisible(true)}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <AddIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <UserSearch />
            <UserTable
              count={data.length}
              items={users}
              onDeselectAll={usersSelection.handleDeselectAll}
              onDeselectOne={usersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={usersSelection.handleSelectAll}
              onSelectOne={usersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={usersSelection.selected}
            />
          </Stack>
        </Container>
        <Modal show={visible} onHide={()=>setVisible(false)} className={cx('add-employee-modal')} >
        <Modal.Header>
            <div className={cx('title-modal')}>Thêm nhân viên</div>
        </Modal.Header>
        <Modal.Body >
            <div className={cx('row align-items-center', 'modal-content-item')}>
              <div>
                <div className={cx('col-lg-3 col-md-3', 'heading-modal')}>
                    <div>Full name</div>
                </div>
                <input
                    type="text"
                    // onChange={(e) => setName(e.target.value)}
                    className={cx('col-lg-8 col-md-8')}
                />
              </div>  
            </div>
            <div className={cx('row align-items-center', 'modal-content-item')}>
              <div>
                <div className={cx('col-lg-3 col-md-3', 'heading-modal')}>
                    <div>Email</div>
                </div>
                <input
                    type="email"
                    // onChange={(e) => setEmail(e.target.value)}
                    className={cx('col-lg-9 col-md-9')}
                />
              </div>  
            </div>
            <div className={cx('row align-items-center', 'modal-content-item')}>
              <div>
                <div className={cx('col-lg-3 col-md-3', 'heading-modal')}>
                    <div>Phone</div>
                </div>
                <input
                    type="text"
                    // onChange={(e) => setPhones(e.target.value)}
                    className={cx('col-lg-9 col-md-9')}
                />
              </div>
            </div>
            <div className={cx('row align-items-center', 'modal-content-item')}>
              <div>
                <div className={cx('col-lg-3 col-md-3', 'heading-modal')}>
                    <div>Address</div>
                </div>
                <input
                    type="text"
                    // onChange={(e) => setAddresses(e.target.value)}
                    className={cx('col-lg-9 col-md-9')}
                />
              </div>
            </div>
            <div className={cx('row align-items-center', 'modal-content-item')}>
              <div>
                <div className={cx('col-lg-3 col-md-3', 'heading-modal')}>
                    <div>Date of birth</div>
                </div>
                <input
                    type="date"
                    // onChange={(e) => setDateOfbirth(e.target.value)}
                    className={cx('col-lg-9 col-md-9')}
                />
              </div>
            </div>
            <div className={cx('row align-items-center', 'modal-content-item')}>
              <div>
                <div className={cx('col-lg-3 col-md-3', 'heading-modal')}>
                    <div>Gender</div>
                </div>
                <span className={cx('gender')}>
                    <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        style={{width: "auto", margin: "10px 10px 0px 20px"}}
                        // onChange={(e) => setGender(e.target.value)}
                    />
                    <label for="male">Male</label>
                    <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        style={{width: "auto", margin: "10px 10px 0px 20px"}}
                        // onChange={(e) => setGender(e.target.value)}
                    />
                    <label for="female">Female</label>
                </span>
              </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <div style={{width: "70%", display: "flex", justifyContent: "space-between"}}>
            <button className={cx('modal-button')} 
              style={{backgroundColor: "#ff0000", border: "none", color: "white", borderRadius: "10px"}}
              onClick={()=>setVisible(false)}
            >
                CLOSE
            </button>
            <button className={cx('modal-button')} 
              style={{backgroundColor: "#1976d2", border: "none", color: "white", borderRadius: "10px"}}
            >
                ADD
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      </Box>
    </>
  );
};

export default UsersManage;
