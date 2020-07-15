import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 200,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not<T>(a: T[], b: T[]) {
  return a.filter(value => b.indexOf(value) === -1);
}

function intersection<T>(a: T[], b: T[]) {
  return a.filter(value => b.indexOf(value) !== -1);
}

function union<T>(a: T[], b: T[]) {
  return [...a, ...not(b, a)];
}

interface ItemObject {
  id: string | number;
  label: string;
}

interface MultiSelectProps {
  title: string;
  items: ItemObject[];
}

const MultiSelect: React.FC<MultiSelectProps> = ({ title, items }) => {
  const classes = useStyles();

  const [checked, setChecked] = useState<ItemObject[]>([]);

  const numberOfChecked = useMemo(() => intersection(checked, items).length, [
    checked,
    items,
  ]);

  function handleToggleAll() {
    if (numberOfChecked === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  }

  function handleToggle(item: ItemObject) {
    const currentIndex = checked.findIndex(el => el.id === item.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(item);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  }

  return (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={( // eslint-disable-line
          <Checkbox
            onClick={() => handleToggleAll()}
            checked={numberOfChecked === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked !== items.length && numberOfChecked !== 0
            }
            disabled={items.length === 0}
          />
        )} // eslint-disable-line
        title={title}
        subheader={`${numberOfChecked}/${items.length} selecionados`}
      />

      <Divider />

      <List className={classes.list} dense component="div" role="list">
        {items.map(item => {
          const labelId = `transfer-list-all-item-${String(item.id)}-label`;

          return (
            <ListItem
              key={String(item.id)}
              role="listitem"
              button
              onClick={() => handleToggle(item)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.findIndex(el => el.id === item.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={item.label} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );
};

export default MultiSelect;
